# Phase 4: Implementation Guide

## Goal
Based on the implementation plan produced in Phase 3, generate a **complete, runnable codebase**.

---

## Core Behavioral Control Rules

### ⚠️ CRITICAL BEHAVIORAL RULES

```
⚠️ SINGLE FILE PER RESPONSE:
- Implement exactly one file per response
- Do not ask for permission between files
- Keep implementing until completion

DO:
- Implement exactly what the paper specifies
- Write simple, direct code
- Make it work first; make it elegant later
- Test each component immediately
- Move to the next file right after finishing the current one

DON'T:
- Don't ask “Should I implement the next file?” between files
- Don't waste time on fancy tooling instead of paper requirements
- No broad documentation that isn't required for reproduction
- No optimization utilities that aren't needed for reproduction
- No excessive abstraction or design patterns
- Don't provide instructions only without writing real code
```

### Tool-Calling Strategy

```
TOOL CALLING STRATEGY:
1. ⚠️ Implement one file per message
2. Verify results, then plan the next step
3. File implementation cycle: analyze → implement → next file

EXECUTION PATTERN:
- Plan First: explain reasoning before each task
- One Step at a Time: run → verify result → plan next → run
- Iterative Progress: build the solution incrementally
- Strategic Sequencing: choose the next step logically based on prior results

⚠️ CRITICAL: use bash and python tools to reproduce the paper directly
            - do not only give instructions; implement it for real
```

---

## Top Priority

Implement **all** algorithms, experiments, and methods mentioned in the paper.
Success is measured by **completeness and correctness**, not code elegance.

### Core Strategy
- Read the paper and the implementation plan thoroughly and identify every algorithm, method, and experiment
- Implement core algorithms first, then the environment, then integration
- Use the exact versions and specifications stated in the paper
- Test each component immediately after implementing it
- Focus on working implementation over perfect architecture

---

## Implementation Approach

### Incremental, File-by-File Construction
At each step:
1. **Identify**: confirm what to implement next from the implementation plan
2. **Implement**: implement one component at a time
3. **Test**: test immediately to catch issues early
4. **Integrate**: integrate with existing components
5. **Validate**: verify against the paper’s specifications

---

## Implementation Order

### Step 1: Setup and Environment Files
```
pyproject.toml     # uv project config (generated via uv init)
config.py          # all hyperparameters and configuration
```

### Step 2: Core Utilities and Base Modules
```
utils/__init__.py
utils/helpers.py   # common utility functions
```

### Step 3: Main Implementation Modules
```
models/__init__.py
models/network.py      # core network architecture
models/components.py   # individual components

algorithms/__init__.py
algorithms/core.py     # main algorithm implementation
```

### Step 4: Training Pipeline
```
training/__init__.py
training/losses.py    # loss functions
training/trainer.py   # training loop
```

### Step 5: Evaluation and Experiments
```
evaluation/__init__.py
evaluation/metrics.py        # evaluation metrics
experiments/run_main.py      # main experiment script
```

### Step 6: Entry Point and Documentation
```
main.py            # main entry point
README.md          # usage documentation (including uv run commands)
```

### Environment Setup Commands (using uv)
```bash
# At project start
uv init
uv add torch numpy [other required packages]

# Run
uv run python main.py
```

---

## Code Quality Standards

### Completeness
- **No** placeholders, TODOs, or incomplete functions
- Full functionality implemented with proper error handling
- Complete APIs with correct signatures and docstrings
- Everything works immediately as specified

### Quality
- Production-grade code following language best practices
- Comprehensive type hints and docstrings
- Appropriate logging, validation, and resource management
- Clean architecture with separation of concerns

### Domain-Specific Adaptation

**Research / ML papers:**
- Mathematical correctness
- Reproducibility (seeds, deterministic ops)
- Evaluation metrics
- Experiment logging

**Systems / tools:**
- CLI interface
- Configuration management
- Error handling
- Documentation

---

## ✅ Completion Checklist (MANDATORY)

Before considering the work complete, you must verify:

```
✅ COMPLETENESS CHECKLIST:
- [ ] All algorithms mentioned in the paper (including abbreviations or alternative names)
- [ ] All environments/datasets in the exact versions specified
- [ ] All comparison methods referenced in experiments
- [ ] A working integration that can run the paper’s experiments
- [ ] A complete codebase that reproduces all metrics, figures, and tables
- [ ] Basic documentation describing how to reproduce results

⚠️ If any item is unchecked, it is NOT complete!
```

---

## Critical Success Factors

```
CRITICAL SUCCESS FACTORS:

1. Accuracy:
   - Match the paper spec exactly (versions, parameters, configuration)
   - Translate equations into code correctly
   - Use hyperparameter values exactly

2. Completeness:
   - Implement all methods discussed, not just the main contribution
   - Implement variants needed for ablation studies
   - Implement what is needed for baseline comparisons

3. Functionality:
   - The code actually runs and executes experiments successfully
   - Training/evaluation works without errors
   - The paper’s results can actually be reproduced
```

---

## Execution Guidelines

### Before implementing each file
1. Confirm the file’s requirements from the implementation plan
2. Confirm dependent files are already implemented
3. Reference the relevant formulas/algorithms from the paper

### While implementing each file
1. Write complete imports
2. Define class/function structure
3. Translate paper formulas/algorithms into code
4. Add appropriate docstrings
5. Add error handling

### After implementing each file
1. Check for syntax errors
2. Ensure imports resolve
3. Run a simple test if possible
4. **Move to the next file immediately** (do not ask for permission)

---

## File Writing Template

### Base Structure for Python Files
```python
"""
[File description]

Paper: [paper title]
Section: [relevant section number]
"""

import ...

# Paper hyperparameters
PARAM_NAME = value  # Source: Section X / Table Y


class ComponentName:
    """
    [Component description]

    Implements Equation X from the paper:
    [equation]
    """

    def __init__(self, ...):
        ...

    def forward(self, ...):
        # Implement Eq. X
        ...


def main():
    """Main entry point"""
    ...


if __name__ == "__main__":
    main()
```

---

## Final Verification

After implementation:

1. **Run test**: does `python main.py` run without errors?
2. **Training test**: does training run on a small dataset?
3. **Result check**: can you reproduce the key paper results?
4. **Docs check**: are run instructions clear in README.md?

If all items pass, implementation is complete!

---

## ⚠️ REMEMBER

```
The goal is to reproduce the entire paper.
Not a single component or a minimal example.

The file-reading tool is PAGINATED, so you may need multiple calls
to read all relevant parts of the paper.

If you find patterns in reference code, use them only as inspiration,
and always implement according to the original paper specification.
```
