# Phase 0: Reference Code Search (Optional Step)

## Purpose
Before implementing the paper, **search for similar implementations** to improve implementation quality.
Reference code is for **inspiration only**, and the original paper specification **always takes priority**.

---

## ⚠️ CRITICAL PRINCIPLES

```
⚠️ REFERENCE CODE USAGE PRINCIPLES:

1. Reference code is for inspiration only
2. The original paper specification always comes first
3. Understand and adapt, do not copy
4. Patterns found in references must be adjusted to paper requirements
5. License compliance is mandatory

DO:
✓ Study structure and design patterns
✓ Learn implementation tricks and optimization techniques
✓ Identify common pitfalls
✓ Learn testing methodologies

DON'T:
✗ Copy code verbatim
✗ Copy bugs from reference implementations
✗ Follow designs that deviate from the paper
✗ Violate licenses
```

---

## Search Protocol

### Step 1: Analyze Paper References

Identify papers in the References section that are likely to have GitHub repositories:

```
High-priority references:
1. Papers cited in methodology/implementation sections
2. Papers mentioned with phrases like “We build upon...” or “We extend...”
3. Methods used as baselines
4. Previous papers by the same authors

Exclude:
- The target paper’s official implementation (if it exists, just use it)
- Purely theoretical papers
- Irrelevant background citations
```

### Step 2: Locate Repositories via Web Search

Search queries using web search tools:

```
Search query patterns:

1. Direct searches:
   - "[Paper Title] GitHub"
   - "[Paper Title] code repository"
   - "[Author Name] [Paper Title] implementation"

2. Algorithm-based searches:
   - "[Algorithm Name] PyTorch implementation"
   - "[Algorithm Name] TensorFlow GitHub"
   - "[Core Method] code example"

3. Keyword combinations:
   - "[Key Term 1] [Key Term 2] GitHub stars:>100"
   - "[Method Name] official implementation"
   - "[Dataset Name] [Method Name] benchmark"

Search tips:
- Search both acronyms and full paper titles
- Check the authors’ GitHub profiles
- Use Papers With Code (paperswithcode.com)
```

### Step 3: Quality Evaluation and Ranking

Evaluate discovered repositories using the following criteria:

```yaml
evaluation_criteria:
  repository_quality:  # 40% weight
    - stars: ">100: Good, >500: Excellent"
    - recent_activity: "Commits within 6 months"
    - documentation: "Quality of README and docstrings"
    - issues_resolved: "Issue response rate"
    - tests: "Presence of test code"

  implementation_relevance:  # 30% weight
    - algorithm_match: "Does the implementation match the paper?"
    - completeness: "Full pipeline vs partial implementation"
    - paper_citation: "Does it cite the paper?"

  technical_depth:  # 20% weight
    - code_quality: "Readability and structure"
    - performance: "Presence of benchmark results"
    - flexibility: "Configurability and extensibility"

  academic_credibility:  # 10% weight
    - author_affiliation: "Author affiliation"
    - official: "Official implementation or not"
    - peer_reviewed: "Reviewed alongside the paper"
```

### Step 4: Select and Analyze Top 5

For each selected repository, record:

```yaml
selected_references:
  - rank: 1
    title: "[Paper/Repository Title]"
    repository_url: "[GitHub URL]"
    relevance_score: 0.95  # scale 0–1

    key_contributions:
      - "What can be learned from this repository (1)"
      - "What can be learned from this repository (2)"

    implementation_value: |
      Detailed explanation of how this implementation helps your work

    usage_suggestion: |
      What parts to reference and how to apply them

    caveats:
      - "Differences from the paper"
      - "License limitations"
```

---

## Output Format

```yaml
reference_search_results:
  search_summary:
    total_found: "Number of related repositories found"
    evaluated: "Number of repositories evaluated"
    selected: 5

  official_implementation:
    exists: true/false
    url: "Official implementation URL (if any)"
    note: "If an official implementation exists, use it first"

  selected_references:
    - rank: 1
      title: "..."
      repository_url: "..."
      relevance_score: 0.95
      key_contributions: [...]
      implementation_value: "..."
      usage_suggestion: "..."
      caveats: [...]

    - rank: 2
      # same structure

    # ... ranks 3, 4, 5

  search_queries_used:
    - "Search query 1"
    - "Search query 2"

  papers_with_code_link: "PWC page URL for the paper"
```

---

## Usage Guidelines

### When to Perform This Step

```
Recommended:
✓ Complex algorithm implementations
✓ Papers with insufficient implementation details
✓ When framework-specific patterns (PyTorch, TensorFlow) are needed
✓ When performance optimization tips are required

Can be skipped:
- Very simple algorithms
- Papers with detailed implementation descriptions
- When you already have similar implementation experience
- When time is limited
```

### How to Use References

```
1. Structural reference:
   - File organization
   - Class/function separation patterns
   - Configuration management

2. Learn implementation tricks:
   - Numerical stability handling
   - Memory optimization
   - Parallelization techniques

3. Testing methodology:
   - Unit test structure
   - Integration test scenarios
   - Benchmark scripts

4. Identify pitfalls:
   - Common bug patterns
   - Performance bottlenecks
   - Environment compatibility issues
```

---

## ⚠️ Self-Check: Reference Search Completion

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REFERENCE SEARCH CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Checked for official implementation?             → YES / NO
□ Used at least 3 different search queries?        → YES / NO
□ Checked Papers With Code?                        → YES / NO
□ Evaluated quality of found repositories?         → YES / NO
□ Completed detailed analysis for top 5?           → YES / NO
□ Verified licenses for each reference?            → YES / NO
□ Documented differences from the paper?           → YES / NO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Notes

```
⚠️ REMEMBER:

Reference code is only supplementary material.

The final implementation must strictly follow the paper specification.
If reference code differs from the paper,
always prioritize the paper’s description.

Bugs or inconsistencies found in reference code
must not be introduced into your implementation.
```
