---
author: Lam
date: 2024-10-21T01:20:36+02:00
title: Useful git commands with fzf
tags:
  - git
---

Combining `git` commands with `fzf` for previewing can enhance your workflow by making it easier to browse through files, commits, branches, and other Git-related data. Here’s a list of useful `git` commands paired with `fzf` that include previewing capabilities.

# 1. Preview File Changes in the Current Branch

```bash
git diff --name-only | fzf --preview 'git diff {}'
```
- **Description**: Lists files that have changes in the current branch. Selecting a file previews the differences for that file.

# 2. Preview Staged Changes

```bash
git diff --cached --name-only | fzf --preview 'git diff --cached {}'
```
- **Description**: Displays files that are staged for commit. Selecting a file shows the staged changes for that file.

# 3. Preview Log History with `git log`

```bash
git log --pretty=format:"%h %s" | fzf --preview 'git show --stat $(echo {} | awk "{print \$1}")'
```
- **Description**: Shows the commit history with both SHA and commit message. Selecting a commit SHA previews the detailed changes and stats for that commit.

# 4. Preview Untracked Files

```bash
git ls-files --others --exclude-standard | fzf --preview 'cat {}'
```
- **Description**: Lists files that are untracked by Git. Selecting a file displays its contents.

# 5. Preview All Files in the Repository

```bash
git ls-files | fzf --preview 'head -n 20 {}'
```
- **Description**: Displays all tracked files in the repository. Selecting a file shows the first 20 lines of that file.

# 6. Preview Commits by Author

```bash
git log --oneline --author=<author_name> | fzf --preview 'git show --stat $(echo {} | awk "{print \$1}")'
```
- **Description**: Filters commits by a specific author (replace `<author_name>`). Selecting a commit previews its details and changes.

# 7. Preview Branches with Last Commit Message

```bash
git branch -vv | fzf --preview 'git log -1 --oneline $(echo {} | awk "{print \$1}")'
```
- **Description**: Lists branches along with their last commit messages. Selecting a branch shows the last commit details.

# 8. Preview Tags with Commit Messages

```bash
git tag -n | fzf --preview 'git show $(echo {} | awk "{print \$1}")'
```
- **Description**: Lists all tags with their associated commit messages. Selecting a tag previews the commit associated with that tag.

# 9. Preview Changes for a Specific File in a Commit

```bash
git log --name-only --pretty=format:"%H" | fzf --preview 'git show --stat $(echo {} | awk "{print \$1}")'
```
- **Description**: Shows commits along with the files they changed. Selecting a commit previews the changes made in that commit.

# 10. Preview Git Blame for a File

```bash
git ls-files | fzf --preview 'git blame {}'
```
- **Description**: Lists all tracked files in the repository. Selecting a file shows the blame information for that file, indicating who last modified each line.

# Summary

These commands leverage `fzf` for a more informative interface while ensuring that only the necessary SHA is passed to commands that require it. Each command is designed to enhance your workflow when working with Git, allowing for efficient navigation and previewing of commits and files.
