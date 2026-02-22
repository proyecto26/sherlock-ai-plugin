# 🕵️‍♂️ Sherlock AI Plugin

<table>
  <tr>
    <td>
      Paper to Comics
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/proyecto26/MyApp/tree/develop">
        <img src="https://github.com/user-attachments/assets/c55466c0-8871-4be1-92df-dff3131c508f" width="300">
      </a>
    </td>
  </tr>
</table>

> **The Ultimate Research & Implementation Assistant for Claude Code & Cursor**

Sherlock is a curated collection of high-powered AI skills designed to transform your research workflow. It doesn't just read papers—it deduces, visualizes, and reconstructs them into working code.

From **deep-diving into literature** to **converting methodology into Python**, Sherlock equips your AI agent with the tools of a master detective and a master engineer.

## 🧰 The Essentials Kit (Features)

Sherlock equips your agent with these specialized skills:

### 🧩 **1. Paper2Code (The Engineer)**
*Transforms academic theory into executable reality.*
- **4-Stage Pipeline**: Systematically converts research papers into code (Algorithm Extraction → Concept Analysis → Planning → Implementation).
- **No Hallucinations**: Forces a structured intermediate representation (YAML) before writing a single line of code.
- **Reproducibility First**: Prioritizes accuracy and paper fidelity over "clever" coding.

### 📚 **2. Deep Research (The Detective)**
*The heavy lifter for comprehensive reports.*
- **Multi-Pass Drafting**: Spawns parallel sub-agents to draft different sections of a report.
- **Evidence Tracking**: Maintains strictly cited evidence tables—no claim goes unsourced.
- **High Fidelity**: Produces professional-grade reports with strict formatting compliance.

### 🎨 **3. Paper Comic (The Storyteller)**
*Explains the unexplainable through visual narratives.*
- **Visual Translation**: Turns dense academic text into educational comics.
- **Style Adaptive**: Choose from Classic, Tech/Futuristic, Warm, or Chalkboard art styles.
- **Gemini Powered**: Uses the `genimg-gemini-web` skill for consistent character consistency across panels.

### 🔬 **4. Paper Analyzer (The Analyst)**
*X-Ray vision for PDFs.*
- **MinerU Integration**: High-precision parsing of formulas, tables, and latex from PDFs.
- **Style Rewrite**: Can rewrite complex papers into "Storytelling", "Academic", or "Concise" formats.
- **Metadata Extraction**: Automatically pulls title, authors, and citations.

### 🖼️ **5. GenImg Gemini Web (The Artist)**
*The visual engine.*
- **Image Generation**: Generates images via Google's Gemini Web.
- **Multi-Modal**: Handles text-to-image and image-to-text tasks.
- **Session Awareness**: Maintains context across multi-turn conversations for consistent output.

### 📐 **6. Visual Architect (The Designer)**
*Blueprints for understanding.*
- **Schema Generation**: Transforms methodology sections into structural visual schemas.
- **Prompt Engineering**: Generates high-precision prompts for DALL-E 3 or Midjourney based on paper logic.
- **Layout Logic**: Detects if a system is Linear, Cyclic, Hierarchical, or Parallel.

---

## 🚀 Quick Start

### Installation

#### Option 1: CLI Install (Recommended)

Use [npx skills](https://github.com/vercel-labs/skills) to install skills directly:

```bash
# Install all skills
npx skills add proyecto26/sherlock-ai-plugin

# Install specific skills
npx skills add proyecto26/sherlock-ai-plugin --skill paper-comic genimg-gemini-web

# List available skills
npx skills add proyecto26/sherlock-ai-plugin --list
```

This automatically installs to your `.claude/skills/` directory.

#### Option 2: Claude Code Plugin

Install via Claude Code's built-in plugin system:

```bash
# Add the marketplace
/plugin marketplace add proyecto26/sherlock-ai-plugin

# Install all marketing skills
/plugin install sherlock-ai-plugin
```

#### Option 3: Clone and Copy

Clone the entire repo and copy the skills folder:

```bash
git clone https://github.com/proyecto26/sherlock-ai-plugin.git
cp -r sherlock-ai-plugin/skills/* .claude/skills/
```

#### Option 4: Git Submodule

Add as a submodule for easy updates:

```bash
git submodule add https://github.com/proyecto26/sherlock-ai-plugin.git .claude/sherlock-ai-plugin
```

Then reference skills from `.claude/sherlock-ai-plugin/skills/`.

#### Option 5: Fork and Customize

1. Fork this repository
2. Customize skills for your specific needs
3. Clone your fork into your projects


### Authentication
Some skills (like `paper-analyzer`) require API tokens or login sessions.
*   **MinerU**: Export `MINERU_TOKEN` in your environment.

### Usage Examples

**"Implement the code of this paper for me."**
> Triggers **Paper2Code** to read the PDF, plan the architecture, and write the Python implementation.

**"Explain this complex transformer architecture as a comic."**
> Triggers **Paper Comic** to create a visual storyboard explaining the concept.

**"I need a deep research report on the state of LLM reasoning."**
> Triggers **Deep Research** to crawl, analyze, and compile a multi-page cited report.

**"Visualize the flow of data in this system."**
> Triggers **Visual Architect** to design a schematic diagram prompt.

---

## 📂 Structure

```
skills/
├── deep-research/       # Report generation & evidence tracking
├── paper2code/          # Paper implementation pipeline
├── paper-comic/         # Educational comic generator
├── paper-analyzer/      # PDF parsing & style rewriting
├── genimg-gemini-web/   # Image generation backend
└── visual-architect/    # Visual schema design
```

---

## 🤝 Contribution

Sherlock AI learns from the community. If you have a new skill module or an improvement to an existing detective tool, please open a PR!

## Credits

- [Claude Code skills for academic papers](https://github.com/zsyggg/paper-craft-skills)

## Happy coding 💯
Made with ❤️

<img width="150px" src="https://avatars0.githubusercontent.com/u/28855608?s=200&v=4" align="right">
