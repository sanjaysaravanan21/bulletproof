---
name: pr-review
description: 'Review a GitHub pull request for bugs, behavioral regressions, security or data risks, and missing tests. Use when asked to review, inspect, or provide feedback on a PR; do not implement fixes.'
argument-hint: 'Provide a PR URL or number and any areas of concern'
---

# Pull Request Review

Review the requested pull request independently. Prioritize actionable defects and risks over style preferences, and do not modify the implementation.

## Review Procedure

1. Identify the repository and pull request, then inspect its title, description, base/head branches, changed files, and relevant checks.
2. Read the full changed code and enough surrounding implementation, tests, and call sites to understand behavior. Compare against the base revision rather than relying only on the PR description.
3. Trace each suspected issue to a concrete user-visible or system consequence. Check edge cases, error handling, authorization, data integrity, compatibility, and concurrency where relevant.
4. Look for missing or ineffective tests for changed behavior. Run a focused test or check only when it helps resolve a material uncertainty and the environment supports it.
5. Return findings first, ordered by severity. Include precise file and line references, the triggering condition, and the consequence. Report only actionable findings; do not present speculative concerns as defects.
6. If there are no findings, state that clearly and mention meaningful test gaps or residual risks. Distinguish checks that passed, failed, were skipped, or could not be run.

## Severity

- **Critical**: likely broad outage, irreversible data loss, or severe security exposure.
- **High**: serious defect affecting core functionality or exposing sensitive data under realistic conditions.
- **Medium**: user-visible behavior is incorrect or a significant edge case is unhandled.
- **Low**: limited impact with a concrete, reproducible consequence.

Do not assign severity to style-only preferences. Avoid reporting issues that are already prevented by validation or are outside the PR's changed behavior unless the change introduces the risk.

## Review Output

Use this order:

1. Findings, with severity, precise location, impact, and relevant conditions.
2. Open questions or assumptions, if any.
3. A brief summary of the review and checks, including gaps.

For a GitHub-hosted PR, use the connected GitHub review workflow when available. For reviews with line-specific comments, create a pending review, add the comments, then submit it. Do not submit comments or a review unless the user asked you to publish the review; otherwise provide the review in chat.
