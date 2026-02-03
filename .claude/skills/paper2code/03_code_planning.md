# Phase 3: Code Planning

## Goal
Integrate the results from Phase 1 (Algorithm Extraction) and Phase 2 (Concept Analysis) to create a detailed plan that allows a developer to implement the entire project **without reading the paper**.

---

## ⚠️ Content Balance Guidelines (STRICTLY FOLLOW)

```
📏 CONTENT BALANCE GUIDELINES:

Section 1 (file_structure):           ~800-1000 chars
Section 2 (implementation_components): ~3000-4000 chars  ← CORE SECTION
Section 3 (validation_approach):       ~2000-2500 chars
Section 4 (environment_setup):         ~800-1000 chars
Section 5 (implementation_strategy):   ~1500-2000 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Total Target: 8000-10000 chars
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Section 2 is the most important! Include all algorithms, equations, and parameters.
⚠️ If the length is insufficient, details are missing - check again.
```

---

## Input
1. **Phase 1 Result**: Complete Algorithm Extraction (algorithm_extraction.yaml)
2. **Phase 2 Result**: Comprehensive Paper Analysis (concept_analysis.yaml)

---

## Planning Process

### 1. Information Integration
Combine **everything** from both analyses:
- All algorithms and pseudocode
- All components and architectures
- All hyperparameters and values
- All experiments and expected results

### 2. Implementation Mapping
Connect each component to a specific implementation:

```
[For each algorithm/component/method in the paper]:
  - What it does in the paper and location
  - How to structure the code (File, Class, Function)
  - Specific equations, algorithms, procedures required for implementation
  - Dependencies and relationships with other components
  - Implementation approach suitable for this paper
```

### 3. Technical Detail Extraction
Collect all technical details related to implementation:

```
[Collect all implementation-related details from the paper]:
  - All algorithms with complete pseudocode and mathematical formulation
  - All parameters, hyperparameters, settings
  - All architecture details (if applicable)
  - All experiment procedures and evaluation methods
  - Mentioned implementation hints, tricks, special considerations
```

---

## Output Format: 5 Required Sections

```yaml
complete_reproduction_plan:
  paper_info:
    title: "[Full Paper Title]"
    core_contribution: "[Key innovation to reproduce]"

  # ============================================
  # Section 1: File Structure (~800-1000 chars)
  # ============================================
  # File configuration design best suited for this paper
  # - Analyze paper content (algorithms, models, experiments, systems, etc.)
  # - Organize files and directories in the most logical way for implementation
  # - Meaningful naming and grouping based on paper content
  # - Clean, intuitive, and focused on actual implementation
  # - Include doc files (README.md, requirements.txt) but implement them last

  file_structure: |
    project_name/
    ├── main.py                    # Main entry point
    ├── config.py                  # Configuration and hyperparameters
    ├── models/
    │   ├── __init__.py
    │   ├── network.py             # Core network architecture
    │   └── components.py          # Individual components
    ├── algorithms/
    │   ├── __init__.py
    │   └── core_algorithm.py      # Main algorithm implementation
    ├── training/
    │   ├── __init__.py
    │   ├── trainer.py             # Training loop
    │   └── losses.py              # Loss functions
    ├── evaluation/
    │   ├── __init__.py
    │   └── metrics.py             # Evaluation metrics
    ├── utils/
    │   ├── __init__.py
    │   └── helpers.py             # Utility functions
    ├── experiments/
    │   └── run_experiments.py     # Experiment scripts
    ├── requirements.txt           # Dependencies (implement last)
    └── README.md                  # Documentation (implement last)

  # ============================================
  # Section 2: Implementation Components (~3000-4000 chars) - CORE SECTION
  # ============================================
  # Identify and specify all components to be implemented
  # - List of all mentioned algorithms, models, systems, components
  # - For each: Purpose, Location, Algorithm, Formula, Technical Details
  # - Organize according to the actual content of the paper

  implementation_components: |
    ## 1. Core Algorithms

    ### 1.1 [Algorithm Name]
    - Location: algorithms/core_algorithm.py
    - Purpose: [What this algorithm does]
    - Pseudocode:
      ```
      [Copy pseudocode from paper]
      ```
    - Core Formulas:
      - [Eq. X]: L = ...
      - [Eq. Y]: ...
    - Hyperparameters:
      - param1: value1 (Source: Section X)
      - param2: value2 (Source: Table Y)

    ## 2. Model Architecture

    ### 2.1 [Model/Network Name]
    - Location: models/network.py
    - Input: [shape, meaning]
    - Output: [shape, meaning]
    - Layer Configuration:
      - Layer 1: ...
      - Layer 2: ...
    - Special Initialization: [If any]

    ## 3. Training Procedure

    ### 3.1 Training Loop
    - Location: training/trainer.py
    - Epochs/Iterations: [Value]
    - Steps:
      1. [Description of Step 1]
      2. [Description of Step 2]

    ### 3.2 Loss Functions
    - Location: training/losses.py
    - Formula: L_total = ...
    - Meaning of each term: ...

    ## 4. Evaluation

    ### 4.1 Evaluation Metrics
    - Location: evaluation/metrics.py
    - Metric List: [metric1, metric2, ...]
    - Calculation Method for each: ...

  # ============================================
  # Section 3: Validation Approach (~2000-2500 chars)
  # ============================================
  # Design methods to verify that the implementation works correctly
  # - Define necessary experiments, tests, proofs
  # - Specify expected results from the paper (Figures, Tables, Theorems)
  # - Design validation approaches suitable for the domain
  # - Include configuration requirements and success criteria

  validation_approach: |
    ## 1. Unit Tests
    - [ ] Verify each component produces correct output shape
    - [ ] Verify loss function returns correct values
    - [ ] Verify gradients flow correctly

    ## 2. Integration Tests
    - [ ] Run full training pipeline
    - [ ] Overfitting test with small dataset

    ## 3. Reproduce Paper Results

    ### 3.1 Reproduce Table X
    - Expected Result: [Specific Number]
    - Tolerance: ±[Value]
    - Execution Method: `python experiments/run_experiments.py --exp table_x`

    ### 3.2 Reproduce Figure Y
    - Expected Behavior: [Qualitative Description]
    - Execution Method: `python experiments/run_experiments.py --exp figure_y`

    ## 4. Success Criteria
    - [ ] [Specific Result 1]
    - [ ] [Specific Result 2]
    - [ ] [Qualitative Behavior 1]

  # ============================================
  # Section 4: Environment Setup (~800-1000 chars)
  # ============================================
  # Specify what is needed to run the implementation
  # - Programming language and version requirements
  # - External libraries and exact versions (if specified in paper)
  # - Hardware requirements (GPU, Memory, etc.)
  # - Special configuration or installation steps

  environment_setup: |
    ## Python Version
    - Python 3.10+ (uv recommended)

    ## Package Management (Use uv - Recommended)
    Configure independent and reproducible environment using uv:
    ```bash
    # Initialize project
    uv init

    # Add dependencies
    uv add torch numpy [other required packages]

    # Run
    uv run python main.py
    ```

    ## Core Dependencies
    ```
    torch>=2.0.0
    numpy>=1.24.0
    [other required packages]
    ```

    ## Hardware Requirements
    - GPU: [NVIDIA GPU with X GB VRAM]
    - RAM: [Minimum X GB]
    - Storage: [X GB]

    ## Dataset Preparation
    - [Dataset Name]: [Download Method]
    - Preprocessing: [Required Steps]

  # ============================================
  # Section 5: Implementation Strategy (~1500-2000 chars)
  # ============================================
  # Step-by-step implementation approach plan
  # - Decompose implementation into logical steps
  # - Identify dependencies between components
  # - Plan testing and validation at each step
  # - Handle missing details with reasonable default values

  implementation_strategy: |
    ## Phase 1: Foundation (First)
    1. config.py - Define all hyperparameters
    2. utils/helpers.py - Common utility functions

    Validation: Config load test

    ## Phase 2: Core Implementation
    3. models/components.py - Individual components
    4. models/network.py - Full network
    5. algorithms/core_algorithm.py - Main algorithm

    Validation: Check output shape of each component

    ## Phase 3: Training Pipeline
    6. training/losses.py - Loss functions
    7. training/trainer.py - Training loop

    Validation: Overfitting test with small data

    ## Phase 4: Evaluation and Experiments
    8. evaluation/metrics.py - Evaluation metrics
    9. experiments/run_experiments.py - Experiment scripts
    10. main.py - Main entry point

    Validation: Reproduce paper results

    ## Phase 5: Documentation (Last)
    11. pyproject.toml - uv project config and dependencies
    12. README.md - Usage documentation (include uv run commands)

    ## Handling Missing Details
    - [Missing Item 1]: [Proposed Default Value]
    - [Missing Item 2]: [Proposed Approach]
```

---

## Important Principles

1. **Completeness**: All 5 sections must be included.
2. **Detail**: All algorithms, equations, parameters, and files must be explicitly stated.
3. **Executability**: You must be able to write code using only this plan.
4. **Logical Order**: Present implementation order considering dependencies.
5. **Validation Included**: Specify success criteria and testing methods.

## File Priority Guidelines

1. **First**: Core Algorithm/Model files (Highest Priority)
2. **Second**: Support Modules and Utilities
3. **Third**: Experiment and Evaluation Scripts
4. **Fourth**: Configuration and Data Processing
5. **Last**: Documentation files (README.md, requirements.txt)

**Note**: README and requirements.txt depend on the final implementation, so write them last.

---

## ⚠️ Self-Check: Mandatory Validation Before Completion (MANDATORY)

Ensure the following before considering the implementation plan complete:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ SELF-CHECK BEFORE FINISHING (Must be all YES to complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section Inclusion Check:
□ file_structure section included?           → YES / NO
□ implementation_components section included? → YES / NO
□ validation_approach section included?       → YES / NO
□ environment_setup section included?         → YES / NO
□ implementation_strategy section included?   → YES / NO

Content Completeness Check:
□ All algorithms from paper mapped to components? → YES / NO
□ All equations have Equation numbers and sources? → YES / NO
□ All hyperparameters have values and sources?    → YES / NO
□ Implementation order correctly reflects dependencies? → YES / NO
□ Validation methods include specific expected results? → YES / NO

Length Check:
□ Is total length over 8000 chars?            → YES / NO
□ Is Section 2 the most detailed?             → YES / NO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ If even one is NO, continue writing until done!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## DO / DON'T Guidelines

```
DO:
✓ Integrate all extraction results from Phase 1 & 2 into the plan
✓ Specify concrete algorithms/equations to implement in each file
✓ Clearly mark dependencies between files
✓ Include all necessary information for implementation (self-contained)
✓ Specify specific figures/behaviors in validation methods

DON'T:
✗ Incomplete descriptions like "Refer to paper for details"
✗ Abstract component descriptions (without specific formulas/algorithms)
✗ Write implementation plan without validation methods
✗ Place files ignoring dependency order
✗ Write Core Section (Section 2) briefly
```