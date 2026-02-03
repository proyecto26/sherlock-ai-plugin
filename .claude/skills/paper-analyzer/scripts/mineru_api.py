#!/usr/bin/env python3
"""
MinerU API client script – parse PDFs using the cloud API
Advantages: high accuracy, supports formulas/tables, no local processing required
"""

import os
import sys
import json
import time
import requests
import zipfile
from pathlib import Path
from typing import Optional, Dict


class MinerUAPI:
    """MinerU Cloud API client"""

    BASE_URL = "https://mineru.net/api/v4"

    def __init__(self, token: str):
        self.token = token
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }

    def submit_task(
        self,
        pdf_url: str,
        enable_formula: bool = True,
        enable_table: bool = True,
        enable_ocr: bool = False,
        language: str = "auto"
    ) -> Optional[str]:
        """Submit a PDF parsing task and return the batch_id"""

        url = f"{self.BASE_URL}/extract/task"
        data = {
            "url": pdf_url,
            "enable_formula": enable_formula,
            "enable_table": enable_table,
            "enable_ocr": enable_ocr,
            "language": language
        }

        try:
            response = requests.post(url, headers=self.headers, json=data, timeout=30)
            result = response.json()

            if result.get("code") == 0 and result.get("data"):
                batch_id = result["data"].get("batch_id")
                print(f"✓ Task submitted successfully, batch_id: {batch_id}")
                return batch_id
            else:
                print(f"✗ Task submission failed: {result.get('msg', 'Unknown error')}")
                return None

        except Exception as e:
            print(f"✗ Request exception: {e}")
            return None

    def submit_task_file(
        self,
        pdf_path: Path,
        enable_formula: bool = True,
        enable_table: bool = True,
        enable_ocr: bool = False,
        language: str = "auto"
    ) -> Optional[str]:
        """
        Upload a local PDF file and submit a parsing task

        Workflow:
        1. Call /file-urls/batch to get a signed upload URL
        2. Upload the file using PUT (do NOT set Content-Type)
        3. Parsing starts automatically and returns a batch_id
        """

        try:
            # Step 1: Get signed upload URL
            url = f"{self.BASE_URL}/file-urls/batch"
            data = {
                "enable_formula": enable_formula,
                "enable_table": enable_table,
                "enable_ocr": enable_ocr,
                "language": language,
                "files": [
                    {"name": pdf_path.name}
                ]
            }

            print("Requesting upload URL...")
            response = requests.post(url, headers=self.headers, json=data, timeout=30)
            result = response.json()

            if result.get("code") != 0:
                print(f"✗ Failed to get upload URL: {result.get('msg', 'Unknown error')}")
                print(f"  Response: {result}")
                return None

            batch_id = result["data"].get("batch_id")
            file_urls = result["data"].get("file_urls", [])

            if not file_urls:
                print("✗ No upload URL received")
                return None

            upload_url = file_urls[0]
            print(f"✓ Upload URL received, batch_id: {batch_id}")

            # Step 2: Upload file using PUT (important: do not set Content-Type)
            size_mb = pdf_path.stat().st_size / 1024 / 1024
            print(f"Uploading file ({size_mb:.1f} MB)...")
            with open(pdf_path, "rb") as f:
                file_data = f.read()

            # NOTE: Do not set Content-Type, or the signed URL will return 403
            upload_response = requests.put(upload_url, data=file_data, timeout=300)

            if upload_response.status_code not in [200, 201]:
                print(f"✗ File upload failed: HTTP {upload_response.status_code}")
                print(f"  Response: {upload_response.text[:500]}")
                return None

            print("✓ File uploaded successfully!")
            return batch_id

        except Exception as e:
            print(f"✗ Upload exception: {e}")
            import traceback
            traceback.print_exc()
            return None

    def get_result(self, batch_id: str) -> Optional[Dict]:
        """Query parsing results by batch_id"""

        url = f"{self.BASE_URL}/extract-results/batch/{batch_id}"

        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            result = response.json()

            if result.get("code") == 0:
                return result.get("data")
            else:
                print(f"Query failed: {result.get('msg', 'Unknown error')}")
                return None

        except Exception as e:
            print(f"Query exception: {e}")
            return None

    def wait_for_result(
        self,
        batch_id: str,
        max_wait: int = 300,
        interval: int = 5
    ) -> Optional[Dict]:
        """Poll until parsing is complete"""

        print(f"Waiting for parsing to complete (max {max_wait} seconds)...")
        start_time = time.time()

        while time.time() - start_time < max_wait:
            result = self.get_result(batch_id)

            if result:
                files = result.get("extract_result", [])
                if files:
                    file_info = files[0]
                    state = file_info.get("state", "")

                    if state == "done":
                        print("✓ Parsing completed!")
                        return file_info
                    elif state == "failed":
                        print(f"✗ Parsing failed: {file_info.get('err_msg', 'Unknown error')}")
                        return None
                    else:
                        elapsed = int(time.time() - start_time)
                        print(f"  Status: {state}... ({elapsed}s)")

            time.sleep(interval)

        print("✗ Timed out waiting for results")
        return None

    def download_result(self, file_info: Dict, output_dir: Path) -> Dict:
        """Download and extract parsing results"""

        output_dir.mkdir(parents=True, exist_ok=True)

        zip_url = file_info.get("full_zip_url")
        if not zip_url:
            print("✗ Download URL not found")
            return {}

        print(f"Downloading results: {zip_url}")

        zip_path = output_dir / "result.zip"
        try:
            response = requests.get(zip_url, timeout=120)
            with open(zip_path, "wb") as f:
                f.write(response.content)
            print(f"✓ Download completed: {zip_path}")

            # Extract ZIP
            with zipfile.ZipFile(zip_path, "r") as z:
                z.extractall(output_dir)
            print(f"✓ Extraction completed: {output_dir}")

            # Locate markdown file
            md_files = list(output_dir.glob("**/*.md"))
            images_dir = output_dir / "images"
            if not images_dir.exists():
                for d in output_dir.rglob("images"):
                    if d.is_dir():
                        images_dir = d
                        break

            # Clean up ZIP
            zip_path.unlink()

            return {
                "method": "mineru_api",
                "markdown_path": str(md_files[0]) if md_files else None,
                "images_dir": str(images_dir) if images_dir.exists() else None,
                "image_count": len(list(images_dir.glob("*"))) if images_dir.exists() else 0
            }

        except Exception as e:
            print(f"✗ Download/extraction failed: {e}")
            return {}


def convert_pdf(pdf_path: str, output_dir: str, token: str) -> Dict:
    """Main entry point: convert a PDF using MinerU API"""

    pdf_path = Path(pdf_path).resolve()
    output_dir = Path(output_dir).resolve()

    if not pdf_path.exists():
        print(f"✗ PDF file not found: {pdf_path}")
        return {}

    print(f"PDF: {pdf_path}")
    print(f"Output directory: {output_dir}")
    print("-" * 40)

    api = MinerUAPI(token)

    # Submit task
    batch_id = api.submit_task_file(pdf_path)
    if not batch_id:
        return {}

    # Wait for result
    file_info = api.wait_for_result(batch_id)
    if not file_info:
        return {}

    # Download result
    result = api.download_result(file_info, output_dir)

    # Save metadata
    if result:
        info_path = output_dir / "convert_info.json"
        with open(info_path, "w") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"\nConversion metadata saved: {info_path}")

    return result


def main():
    if len(sys.argv) < 3:
        print("Usage: python mineru_api.py <pdf_path> <output_dir> [token]")
        print("\nArguments:")
        print("  pdf_path   - Path to the PDF file")
        print("  output_dir - Output directory")
        print("  token      - MinerU API token (or set MINERU_TOKEN env var)")
        print("\nExamples:")
        print("  python mineru_api.py paper.pdf ./output")
        print("  MINERU_TOKEN=xxx python mineru_api.py paper.pdf ./output")
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_dir = sys.argv[2]
    token = sys.argv[3] if len(sys.argv) > 3 else os.environ.get("MINERU_TOKEN", "")

    if not token:
        print("✗ MinerU API token is required")
        print("  Option 1: python mineru_api.py paper.pdf ./output YOUR_TOKEN")
        print("  Option 2: export MINERU_TOKEN=YOUR_TOKEN")
        sys.exit(1)

    result = convert_pdf(pdf_path, output_dir, token)

    if result:
        print("\n" + "=" * 40)
        print("Conversion successful!")
        print(f"  Markdown: {result.get('markdown_path')}")
        print(f"  Image count: {result.get('image_count')}")
    else:
        print("\nConversion failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
