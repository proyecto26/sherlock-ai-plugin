# Phase 1: Algorithm Extraction

## Goal
Extract **all technical details** required for implementation from the research paper.
Developers must be able to implement the entire paper using only this extraction result.

---

## ⚠️ DO / DON'T Guidelines (CRITICAL)

```
DO:
✓ Copy pseudocode exactly from the paper (do not change a single character)
✓ Record equations exactly along with equation numbers (Eq. X)
✓ Search for hyperparameters in text, tables, captions, and appendices
✓ Identify and record items that are missing but essential for implementation
✓ Specify sources (Section X, Table Y, Page Z) for all information
✓ Keep variable names, symbols, and subscripts exactly as they appear in the paper

DON'T:
✗ Do not modify equations or pseudocode to make them "easier to understand"
✗ Do not guess parameter values not present in the paper
✗ Do not record information without a source
✗ Do not substitute with "commonly used" values
✗ Do not skip unclear parts (record them in missing_but_critical)
```

---

## ⚠️ Output Restrictions (OUTPUT RESTRICTIONS)

```
⚠️ MANDATORY OUTPUT FORMAT:
- Output MUST be in YAML format only
- Pure YAML without markdown explanations or preambles
- All required fields must be filled
- Record "Not specified in paper" for fields with no information
- Add "[INFERRED]" tag for guessed values

Output Start: "```yaml"
Output End: "```"
```

---

## Extraction Protocol

### 1. Algorithm Scan
Find and extract all of the following from the paper:
- All content in Method/Algorithm sections
- Algorithm boxes (Algorithm 1, 2, 3...)
- Equations and Formulas (All Equations)
- Pseudocode
- Implementation Details

### 2. Deep Algorithm Extraction
For **every** algorithm/method/procedure found:

```yaml
algorithm_name: "[Exact name from paper]"
section: "[e.g., Section 3.2]"
algorithm_box: "[e.g., Algorithm 1 on page 4]"

pseudocode: |
  [Copy pseudocode from paper exactly]
  Input: ...
  Output: ...
  1. Initialize ...
  2. For each ...
     2.1 Calculate ...
  [Maintain exact format and numbering]

mathematical_formulation:
  - equation: "[Copy equation exactly, e.g., L = L_task + λ*L_explain]"
    equation_number: "[e.g., Eq. 3]"
    where:
      L_task: "task loss"
      L_explain: "explanation loss"
      λ: "weighting parameter (default: 0.5)"

step_by_step_breakdown:
  1. "[Detailed description of what Step 1 does]"
  2. "[What Step 2 calculates and why]"

implementation_details:
  - "Uses softmax temperature τ = 0.1"
  - "Gradient clipping at norm 1.0"
  - "Initialize weights with Xavier uniform"
```

### 3. Component Extraction
For **every** component/module mentioned:

```yaml
component_name: "[e.g., Mask Network, Critic Network]"
purpose: "[Role of this component in the system]"
architecture:
  input: "[shape and meaning]"
  layers:
    - "[Conv2d(3, 64, kernel=3, stride=1)]"
    - "[ReLU activation]"
    - "[BatchNorm2d(64)]"
  output: "[shape and meaning]"

special_features:
  - "[Unique features]"
  - "[Special initialization methods]"
```

### 4. Training Procedure Extraction
Extract the **complete** training process:

```yaml
training_loop:
  outer_iterations: "[Count or Condition]"
  inner_iterations: "[Count or Condition]"

  steps:
    1. "Sample batch of size B from buffer"
    2. "Compute importance weights using..."
    3. "Update policy with loss..."

  loss_functions:
    - name: "policy_loss"
      formula: "[Exact formula]"
      components: "[Meaning of each term]"

  optimization:
    optimizer: "Adam"
    learning_rate: "3e-4"
    lr_schedule: "linear decay to 0"
    gradient_norm: "clip at 0.5"
```

### 5. Hyperparameter Collection
Find in text, tables, captions **everywhere**:

```yaml
hyperparameters:
  # Training
  batch_size: 64
  buffer_size: 1e6
  discount_gamma: 0.99

  # Architecture
  hidden_units: [256, 256]
  activation: "ReLU"

  # Algorithm-specific
  explanation_weight: 0.5
  exploration_bonus_scale: 0.1
  reset_probability: 0.3

  # Sources
  location_references:
    - "batch_size: Table 1"
    - "hidden_units: Section 4.1"
```

---

## Output Format

```yaml
complete_algorithm_extraction:
  paper_structure:
    method_sections: "[3, 3.1, 3.2, 3.3, 4]"
    algorithm_count: "[Total number of algorithms found]"

  main_algorithm:
    # Detailed with above format

  supporting_algorithms:
    - # Details for each supporting algorithm

  components:
    - # All components and architectures

  training_details:
    # Complete training procedure

  all_hyperparameters:
    # All parameters, values, and sources

  implementation_notes:
    - "[Implementation hints mentioned in paper]"
    - "[Tricks mentioned in text]"

  missing_but_critical:
    - "[Essential but unspecified items]"
    - "[With proposed default values]"
```

---

## Important Principles

1. **Thorough**: Developers must be able to implement the entire paper using **only** this extraction result
2. **Accurate**: Copy equations, variable names, and values **exactly**
3. **Complete**: All algorithms, all equations, all parameters
4. **Source Cited**: Record where each piece of information came from in the paper
5. **Identify Missing**: Identify what is not in the paper but needed for implementation

---

## ⚠️ Self-Check: Mandatory Validation Before Completion (MANDATORY)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ SELF-CHECK BEFORE FINISHING (Must be all YES to complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Algorithm Extraction Check:
□ Are all Algorithm boxes (Algorithm 1, 2, ...) extracted?  → YES / NO
□ Are all procedures in the Method section included?        → YES / NO
□ Do all equations have Equation numbers?                   → YES / NO

Hyperparameter Check:
□ Are all parameters mentioned in the text collected?       → YES / NO
□ Are all parameters mentioned in tables collected?         → YES / NO
□ Have parameters in captions/appendices been checked?      → YES / NO

Completeness Check:
□ Is the training procedure completely described?           → YES / NO
□ Are all terms in loss functions defined?                  → YES / NO
□ Are missing essential info recorded in missing_but_critical? → YES / NO

Output Format Check:
□ Is the output in pure YAML format?                        → YES / NO
□ Are all required fields filled?                           → YES / NO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ If even one is NO, continue identifying until done!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```