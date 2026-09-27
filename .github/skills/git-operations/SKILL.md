---
name: git-operations
description: 'Handle common Git workflows in this repository: inspect status and diffs, commit, push, stash, undo a commit, cherry-pick, and raise a pull request. Use when asked to perform or guide Git operations.'
argument-hint: 'Describe the Git operation and any target branch or commit'
---

# Git Operations

Use this skill for focused, user-requested Git workflows. Preserve existing work and keep operations scoped to the requested change.

## Safety Rules

- Start by inspecting the current branch, working tree, staged changes, and relevant commit history. Never assume the worktree is clean.
- Do not discard, overwrite, or revert user changes. Do not use destructive commands such as `git reset --hard`, `git clean`, or `git checkout --` unless the user explicitly requested that exact data loss.
- Do not amend commits, rewrite published history, force-push, or delete branches unless explicitly requested. Explain the consequence and confirm the target when the request is ambiguous.
- Stage only files relevant to the request. Review the staged diff before committing.
- Before any remote write (push, PR creation, or remote branch changes), verify the repository, branch, and destination. Never claim success until the command or integration confirms it.
- Keep credentials and tokens out of command arguments, logs, and responses.

## Workflow

1. Inspect with `git status --short --branch`, `git diff`, `git diff --cached`, and the relevant `git log` or `git show`.
2. Identify unrelated or pre-existing changes and leave them untouched. If they make the requested operation unsafe or ambiguous, ask a concise clarifying question.
3. Perform only the requested operation using the procedures below.
4. Verify the result with `git status`, the resulting commit or stash details, and remote/PR confirmation when applicable. Report what changed and any remaining work.

## Commit

- Confirm the intended files and review their staged diff.
- Stage explicit paths rather than using `git add -A` when unrelated changes may exist.
- Use a concise, imperative commit message that describes the change.
- After committing, verify the commit with `git show --stat --oneline HEAD` and check the worktree.

## Push

- Confirm the target branch and upstream with `git branch -vv` and `git remote -v`.
- Push the intended branch to its expected remote. Do not use force options by default.
- If the branch has no upstream, set one only when the target remote and branch are clear; otherwise ask.
- Verify the push result and report the remote branch.

## Stash

- Inspect the worktree first and avoid stashing unrelated files unless asked.
- Use a descriptive stash message. Include untracked files with `-u` only when the requested work includes them.
- After applying or popping, verify the resulting diff and stash list. Prefer `apply` over `pop` when preserving the stash matters.

## Undo a Commit

First determine whether the commit is local-only or already pushed, and whether the user wants to keep its changes.

- To remove the latest local commit while keeping changes staged, use `git reset --soft HEAD~1` only when that exact outcome is requested.
- To remove the latest local commit while keeping changes unstaged, use `git reset HEAD~1` only when that exact outcome is requested.
- To undo a published commit without rewriting history, prefer `git revert <commit>`.
- Do not use `git reset --hard` or force-push unless the user explicitly names that action and target. If “undo” does not specify whether to keep changes or whether the commit is published, ask before proceeding.

## Cherry-Pick

- Verify the source commit, current target branch, and worktree state before applying it.
- Use `git show --stat <commit>` to confirm the selected commit. Do not cherry-pick a range unless the user requested it.
- If conflicts occur, preserve existing work, explain the conflicted paths, and resolve only when the intended resolution is clear. Otherwise leave the operation recoverable and ask how to proceed.
- Verify the resulting commit and status. Do not continue an uncertain cherry-pick sequence.

## Raise a Pull Request

1. Confirm the feature branch is pushed and identify the intended base branch.
2. Review the complete branch diff and run relevant project checks. In this repository, use the checks required by the task and `.github/copilot-instructions.md`.
3. Search for a pull request template in `pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE/` and follow it.
4. Create the PR with a clear title, summary, and test evidence. Prefer the connected GitHub integration when available; otherwise use the configured repository tooling.
5. Report the PR URL and confirmed status. Do not create a PR if the base, scope, or required approval is unclear.
