# Phase 2: Concept Analysis

## Goal
Understand the **entire structure** of the research paper and identify **all elements** that must be implemented for successful reproduction.

---

## ⚠️ DO / DON'T Guidelines (CRITICAL)

```
DO:
✓ Systematically map all sections of the paper
✓ Identify data flow and dependencies between all components
✓ Identify all environments/datasets/baselines used in experiments
✓ Define success criteria with specific figures
✓ Evaluate implementation complexity and priority

DON'T:
✗ Do not confuse Related Work with implementation requirements
✗ Do not use abstract success criteria (e.g., "good performance")
✗ Do not omit relationships between components
✗ Do not miss variations needed for ablation studies
```

---

## ⚠️ Output Restrictions (OUTPUT RESTRICTIONS)

```
⚠️ MANDATORY OUTPUT FORMAT:
- Output MUST be in YAML format only
- Pure YAML without markdown explanations or preambles
- All required fields must be filled
- Include specific figures and sources

Output Start: "```yaml"
Output End: "```"
```

---

## Analysis Protocol

### 1. Paper Structure Analysis
Create a complete map of the paper:

```yaml
paper_structure_map:
  title: "[Full title of the paper]"

  sections:
    1_introduction:
      main_claims: "[What the paper claims to achieve]"
      problem_definition: "[Exact problem being solved]"

    2_related_work:
      key_comparisons: "[Methods this work builds upon or competes with]"

    3_method:  # Multiple subsections possible
      subsections:
        3.1: "[Title and main content]"
        3.2: "[Title and main content]"
      algorithms_presented: "[List of all algorithm names]"

    4_experiments:
      environments: "[All test environments/datasets]"
      baselines: "[All comparison methods]"
      metrics: "[All evaluation metrics used]"

    5_results:
      main_findings: "[Core results proving the method works]"
      tables_figures: "[Important result tables/figures to reproduce]"
```

### 2. Methodology Decomposition
For the main method/approach:

```yaml
method_decomposition:
  method_name: "[Full name and abbreviation]"

  core_components:  # Decompose into implementable pieces
    component_1:
      name: "[e.g., State Importance Estimator]"
      purpose: "[Why this component exists]"
      paper_section: "[Location described]"

    component_2:
      name: "[e.g., Policy Refinement Module]"
      purpose: "[Role in the system]"
      paper_section: "[Location described]"

  component_interactions:
    - "[How component 1 passes to component 2]"
    - "[Data flow between components]"

  theoretical_foundation:
    key_insight: "[Key theoretical insight]"
    why_it_works: "[Intuitive explanation]"
```

### 3. Implementation Requirements Mapping
Map paper content to code requirements:

```yaml
implementation_map:
  algorithms_to_implement:
    - algorithm: "[Name in paper]"
      section: "[Location defined]"
      complexity: "[Simple/Medium/Complex]"
      dependencies: "[What is needed to work]"

  models_to_build:
    - model: "[Neural network or other model]"
      architecture_location: "[Section describing it]"
      purpose: "[What this model does]"

  data_processing:
    - pipeline: "[Required data preprocessing]"
      requirements: "[How data should look]"

  evaluation_suite:
    - metric: "[Metric name]"
      formula_location: "[Location defined]"
      purpose: "[What it measures]"
```

### 4. Experiment Reproduction Plan
Identify **all** required experiments:

```yaml
experiments_analysis:
  main_results:
    - experiment: "[Name/Description]"
      proves: "[Claim this validates]"
      requires: "[Components needed to run]"
      expected_outcome: "[Specific number/trend]"

  ablation_studies:
    - study: "[What is removed]"
      purpose: "[What this shows]"

  baseline_comparisons:
    - baseline: "[Method name]"
      implementation_required: "[Yes/No/Partial]"
      source: "[Where to find implementation]"
```

### 5. Key Success Factors
Definition of successful reproduction:

```yaml
success_criteria:
  must_achieve:
    - "[Key result that must be reproduced]"
    - "[Core behavior that must be demonstrated]"

  should_achieve:
    - "[Secondary result validating the method]"

  validation_evidence:
    - "[Specific Figure/Table to reproduce]"
    - "[Qualitative behavior to demonstrate]"
```

---

## Output Format

```yaml
comprehensive_paper_analysis:
  executive_summary:
    paper_title: "[Full Title]"
    core_contribution: "[One sentence summary]"
    implementation_complexity: "[Low/Medium/High]"
    estimated_components: "[Number of key components to build]"

  complete_structure_map:
    # Full section decomposition from above

  method_architecture:
    # Detailed component decomposition

  implementation_requirements:
    # All algorithms, models, data, metrics

  reproduction_roadmap:
    phase_1: "[What to implement first]"
    phase_2: "[What to build next]"
    phase_3: "[Final components and validation]"

  validation_checklist:
    - "[ ] [Specific result to achieve]"
    - "[ ] [Behavior to demonstrate]"
    - "[ ] [Metric to match]"
```

---

## Important Principles

1. **Thorough**: Don't miss anything involved. The output must be a complete blueprint for reproduction.
2. **Structured**: Decompose all parts of the paper into implementable pieces.
3. **Identify Relationships**: Clarify dependencies and data flow between components.
4. **Specify Verification Criteria**: Define what constitutes "successful reproduction".
5. **Set Priorities**: Distinguish between core contributions and additional elements.

---

## ⚠️ Self-Check: Mandatory Validation Before Completion (MANDATORY)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ SELF-CHECK BEFORE FINISHING (Must be all YES to complete)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Paper Structure Analysis Check:
□ Is every Method section mapped?                       → YES / NO
□ Are all algorithm names listed?                       → YES / NO
□ Are all experiments in the experiment section identified? → YES / NO

Component Analysis Check:
□ Are inputs/outputs defined for all components?        → YES / NO
□ Is data flow between components clear?                → YES / NO
□ Is dependency order identified?                       → YES / NO

Experiment Requirements Check:
□ Are all environments/datasets identified?             → YES / NO
□ Are all baseline methods identified?                  → YES / NO
□ Are all evaluation metrics defined?                   → YES / NO
□ Are ablation study variations identified?             → YES / NO

Success Criteria Check:
□ Do must_achieve items include specific figures?       → YES / NO
□ Are specific Tables/Figures specified for reproduction? → YES / NO

Output Format Check:
□ Is output in pure YAML format?                        → YES / NO
□ Are all required fields filled?                       → YES / NO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ If even one is NO, continue analyzing until done!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```