# Memory and Context Management Guide

## Purpose
When processing long papers, this guide helps **prevent context overflow** and **ensure efficient workflow progression**.

---

## Core Strategies

### 1. Save Outputs Incrementally by Phase

After completing each phase, save the results to files to reduce context load:

```
paper_workspace/
├── paper.txt                      # Original paper text
├── 01_algorithm_extraction.yaml   # Phase 1 output
├── 02_concept_analysis.yaml       # Phase 2 output
├── 03_implementation_plan.yaml    # Phase 3 output
└── src/                           # Phase 4 generated code
    ├── config.py
    ├── models/
    ├── algorithms/
    └── ...
```

**Example save commands:**
```bash
# Save Phase 1 results
cat > paper_workspace/01_algorithm_extraction.yaml << 'EOF'
[Phase 1 YAML output]
EOF

# Save Phase 2 results
cat > paper_workspace/02_concept_analysis.yaml << 'EOF'
[Phase 2 YAML output]
EOF
```

### 2. Context Handoff Between Phases

When moving to the next phase, **pass only concise summaries instead of full outputs**:

```yaml
# Phase 1 → Phase 2 summary
phase1_summary:
  algorithms_found: 3
  key_algorithms:
    - "Algorithm 1: [name] – [one-line summary]"
    - "Algorithm 2: [name] – [one-line summary]"
  hyperparameters_count: 15
  critical_equations: [3, 5, 7, 12]

# Phase 2 → Phase 3 summary
phase2_summary:
  components_count: 5
  implementation_complexity: "Medium"
  key_dependencies:
    - "Component A → Component B"
    - "Component B → Component C"
  experiments_count: 4
```

### 3. Memory Optimization During Implementation

Manage context during the file-by-file implementation cycle:

```
File Implementation Cycle:
┌─────────────────────────────────────────────────────┐
│ 1. Load only information needed for the current file │
│    - Relevant section from implementation_plan.yaml │
│    - Interfaces of dependent files (not full code)  │
├─────────────────────────────────────────────────────┤
│ 2. Implement the file                               │
├─────────────────────────────────────────────────────┤
│ 3. Move to the next file after completion            │
│    - Reference previous files only when necessary   │
│    - Do not keep the entire codebase in memory       │
└─────────────────────────────────────────────────────┘
```

---

## Tips for Handling Long Papers

### Read Papers in Segments

For very long papers, analyze section by section:

```
Recommended reading order (priority):
1. Abstract + Introduction (identify core contributions)
2. Entire Method section (extract algorithms)
3. Experiments section (setup, baselines, metrics)
4. Appendix (detailed hyperparameters)
5. Related Work (only if needed)

Can be skipped:
- Detailed Related Work (not required for implementation)
- Long Discussion/Conclusion sections (summary only)
- Acknowledgments
```

### Decompose Large Algorithms

Break complex algorithms into sub-components:

```yaml
# Process incrementally instead of all at once
large_algorithm:
  component_1:
    extracted: true
    summary: "[summary]"
  component_2:
    extracted: true
    summary: "[summary]"
  component_3:
    extracted: false  # not processed yet
```

---

## Self-Monitoring Checkpoints

During implementation, **saving checkpoints** is recommended in the following cases:

```
Checkpoint save triggers:
□ After every 5 implemented files
□ After completing a complex algorithm (>50 lines)
□ When an error occurs (save current state)
□ Before starting a new phase
□ Before long tasks (expected >30 minutes)
```

### Checkpoint Save Template

```yaml
checkpoint_save:
  current_phase: "[current phase number]"
  completed_files:
    - "config.py"
    - "models/network.py"
  current_file: "algorithms/core.py"
  current_progress: "50%"
  next_steps:
    - "[next task 1]"
    - "[next task 2]"
  blockers:
    - "[blocking issue, if any]"
```

---

## Context Recovery Protocol

If the conversation is interrupted or context is lost:

```
Recovery steps:
1. Inspect the paper_workspace/ directory
2. Read the most recent completed phase output
3. List generated source code files
4. Identify the last working point
5. Resume from that point
```

**Example recovery commands:**
```bash
# Inspect current state
ls -la paper_workspace/
ls -la paper_workspace/src/

# Check last phase output
cat paper_workspace/03_implementation_plan.yaml

# List generated files
find paper_workspace/src -name "*.py" -type f
```

---

## Efficient Referencing Patterns

### Reference Interfaces Only

When referring to other files, **reference interfaces instead of full implementations**:

```python
# Reference signatures only, not full code
# Interface from models/network.py:
class NetworkModel:
    def __init__(self, config: Config): ...
    def forward(self, x: Tensor) -> Tensor: ...
    def get_features(self, x: Tensor) -> Tensor: ...
```

### Use Dependency Graphs

Use dependency graphs to determine implementation order:

```
config.py (no dependencies)
    ↓
utils/helpers.py (depends on config only)
    ↓
models/components.py (depends on config, utils)
    ↓
models/network.py (depends on components)
    ↓
algorithms/core.py (depends on network)
    ↓
training/trainer.py (depends on all)
```

---

## ⚠️ Important Notes

```
⚠️ MEMORY MANAGEMENT RULES:

1. Do not process the entire paper at once
   → split by sections

2. Do not pass full outputs from one phase to the next
   → pass concise summaries only

3. Do not keep all generated code in memory
   → save files and reference when needed

4. Save progress periodically during long tasks
   → ensure recovery after interruption

5. Avoid unnecessary re-reading
   → summarize and store information once read
```

---

## Recommended Workflow

```
[Paper Input]
    │
    ▼
[Phase 1: Algorithm Extraction]
    │ → save 01_algorithm_extraction.yaml
    │ → create concise summary
    ▼
[Phase 2: Concept Analysis]
    │ → save 02_concept_analysis.yaml
    │ → keep Phase 1 + Phase 2 summaries
    ▼
[Phase 3: Implementation Plan]
    │ → save 03_implementation_plan.yaml
    │ → retain only implementation-critical info
    ▼
[Phase 4: Code Implementation]
    │ → implement file by file, saving each
    │ → checkpoint every 5 files
    ▼
[Done]
```
