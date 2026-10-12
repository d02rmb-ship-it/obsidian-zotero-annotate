# Publishing your own copy as a GitHub repository

Use this page if you adapt the workflow and want to share it. Back to the [README](../README.md). See also [CONTRIBUTING.md](../CONTRIBUTING.md).

## 1. Public-repo safety review

**This repository is not the Research Vault.** Publish reusable examples, scripts and documentation; do not push live source notes, private project notes or PDFs by default. Before publishing, check all files for private names, usernames, local paths, secrets, research excerpts and materials restricted by copyright. Public Git commits can retain content in history even after later deletion.

## 2. Create a GitHub account and repository (browser method)

1. Sign in to [GitHub](https://github.com/) or create an account.
2. Click the **+** menu → **New repository**.
3. Suggested name: `zotero-zotlit-obsidian-research-workflow`.
4. Suggested description: `Reproducible academic research workflow for Zotero annotations, ZotLit literature notes, and Obsidian evidence dashboards.`
5. Choose **Private** for review/testing, and change to **Public** once the repository content has been checked. You can also create it Public directly when you are certain all material is publishable.
6. Initialize with a README if building the repository directly in GitHub. If uploading this prepared project, use the included `README.md` and avoid generating conflicting starter files where possible.
7. Click **Create repository**.

GitHub's [repository quickstart](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories) documents these steps.

## 3. Recommended repository files

Follow the layout of this repository: a `README.md`, `LICENSE`, `CONTRIBUTING.md`, `.gitignore`, and folders for `templates/`, `scripts/`, `examples/`, `tests/` and `docs/`. Keep real notes and PDFs out of it.

## 4. Upload through GitHub's website

In the repository, select **Add file → Upload files** (or create files one by one), choose the prepared files and directory contents, review the list, and commit with a message such as `Add reproducible Zotero–Obsidian research workflow`. For a full directory tree, uploading using Git or GitHub Desktop may be easier.

## 5. Optional Git command-line method

From a local copy of the folder:

```bash
git init
git add .
git commit -m "Document Zotero-ZotLit-Obsidian research workflow"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zotero-zotlit-obsidian-research-workflow.git
git push -u origin main
```

Create an **empty remote repository** before using this method. Replace `YOUR_USERNAME`, and ensure Git is installed and GitHub authentication is configured. If a remote README or commit already exists, use GitHub Desktop or pull/reconcile histories rather than force-push.

## 6. Maintain and document changes

- Add a changelog or date-stamped README history when templates or script parsing assumptions change.
- State the actual ZotLit, Obsidian and Dataview versions used for each tested release.
- Keep a sample (non-copyrighted) annotation test case to demonstrate `Theory`, `Gap` and `Unclassified` behaviour.
- Use GitHub Issues to track bugs and proposed features, explicitly labelling **tested**, **experimental**, and **planned**.
- If other contributors are expected, add a `CONTRIBUTING.md` and clarify licensing before accepting contributions. Do not assume the upstream ZotLit license automatically licenses all user-authored scripts or third-party text.
