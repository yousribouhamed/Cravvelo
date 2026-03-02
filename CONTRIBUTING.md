# Contributing to Cravvelo

First off, thank you for taking the time to contribute!
Your help is essential to making Cravvelo better for everyone.

---

## 📌 How to Contribute

### 1. Reporting Bugs

- Search the [issues](../../issues) to check if the bug is already reported.
- If not found, open a **new issue** and include:
  - A clear title
  - Steps to reproduce the problem
  - Expected behavior
  - Screenshots or code snippets if relevant
  - Your environment (OS, browser, Node.js version)

---

### 2. Suggesting Features

- Open a **feature request issue** with:
  - The problem your feature would solve
  - How you imagine it working
  - Any alternatives you’ve considered

---

### 3. Making Code Changes

1. **Fork the Repository**  
   Click “Fork” on the top right of this page.

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Cravvelo.git
   cd Cravvelo
   ```

3. **Create a branch**
   ```bash
   git checkout -b fix/short-description
   # or for new features:
   git checkout -b feature/short-description
   ```

4. **Make your changes**  
   Edit the code and ensure it follows the project's style. Run local checks before committing:
   ```bash
   pnpm lint
   pnpm build
   ```

5. **Commit**  
   Use clear, present-tense commit messages (e.g. "Fix login redirect" or "Add P2P payment validation").

6. **Push and open a Pull Request**
   ```bash
   git push origin fix/short-description
   ```
   Then open a Pull Request from your fork against this repository's default branch.

7. **What we expect in a PR**
   - A short description of what changed and why
   - A link to the related issue (if any)
   - Confirmation that `pnpm lint` and `pnpm build` pass
   - No secrets or credentials in the diff
   - For notable user-facing or breaking changes, an update to [CHANGELOG.md](CHANGELOG.md) (or we can add it on merge)

Maintainers will review your PR and may request changes. Once approved, it will be merged.

---

## Automated tests

We do not yet have a full automated test suite. Running `pnpm lint` and `pnpm build` is required before submitting a PR. If you add tests (e.g. unit or e2e), please run them locally and we welcome contributions to improve test coverage.
