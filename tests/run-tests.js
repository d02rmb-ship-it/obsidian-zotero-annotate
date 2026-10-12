#!/usr/bin/env node
// Regression test for scripts/research-evidence.js.
//
// It runs the real DataviewJS script against synthetic ZotLit-style source
// notes in tests/fixtures/vault and compares the rendered output with
// tests/expected-output.md. No Obsidian, Zotero or npm packages are needed.
//
// Usage (Node 18 or later):  node tests/run-tests.js

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const vault = path.join(__dirname, "fixtures", "vault");
const scriptPath = path.join(root, "scripts", "research-evidence.js");
const expectedPath = path.join(__dirname, "expected-output.md");
const COLLECTION = "Coursework/COURSE101/Example Project/Literature";

// --- Minimal stand-in for the parts of the Dataview API the script uses ---

function listMarkdown(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdown(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function readFrontmatter(text) {
  const match = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  if (!match) return data;
  let listKey = null;
  for (const line of match[1].split("\n")) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { data[listKey].push(item[1].trim()); continue; }
    const pair = line.match(/^([\w-]+):\s*(.*)$/);
    if (!pair) continue;
    if (pair[2] === "") { listKey = pair[1]; data[listKey] = []; }
    else { listKey = null; data[pair[1]] = pair[2].trim(); }
  }
  return data;
}

function makeDv(output) {
  return {
    pages(source) {
      const folder = String(source).replace(/^"|"$/g, "");
      const pages = listMarkdown(path.join(vault, folder)).map(file => {
        const rel = path.relative(vault, file).split(path.sep).join("/");
        const meta = readFrontmatter(fs.readFileSync(file, "utf8"));
        return { ...meta, file: { path: rel, name: path.basename(file, ".md") } };
      });
      pages.where = predicate => pages.filter(predicate);
      return pages;
    },
    io: { load: async rel => fs.readFileSync(path.join(vault, rel), "utf8") },
    header: (level, text) => output.push(`${"#".repeat(level)} ${text}`, ""),
    paragraph: text => output.push(String(text), "")
  };
}

async function render(input) {
  const output = [];
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const run = new AsyncFunction("dv", "input", fs.readFileSync(scriptPath, "utf8"));
  await run(makeDv(output), input);
  return output.join("\n") + "\n";
}

// --- Tests ---

const results = [];
function check(name, ok, detail) {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok && detail) console.log(detail.split("\n").map(l => "      " + l).join("\n"));
}

function firstDifference(actual, expected) {
  const a = actual.split("\n"), e = expected.split("\n");
  for (let i = 0; i < Math.max(a.length, e.length); i++) {
    if (a[i] !== e[i]) {
      return `first difference at line ${i + 1}\nexpected: ${JSON.stringify(e[i])}\nactual:   ${JSON.stringify(a[i])}`;
    }
  }
  return "";
}

(async () => {
  const expected = fs.readFileSync(expectedPath, "utf8").replace(/\r\n/g, "\n");

  const actual = await render({ collection: COLLECTION });
  check("matching collection renders the expected evidence", actual === expected,
        firstDifference(actual, expected));

  check("note from another collection is excluded",
        !actual.includes("ANNOT007") && !actual.includes("Other et al."));

  check("multi-category annotation appears once per category (no duplicates)",
        (actual.match(/ANNOT001/g) || []).length === 2 &&
        (actual.match(/ANNOT005/g) || []).length === 2);

  check("researcher comment is not copied into the evidence text",
        !actual.includes("Check this against the original"));

  check("callout without a Zotero page link is skipped",
        !actual.includes("researcher-written"));

  // Documents current behaviour for annotations that have no highlighted text.
  check("image annotation is kept, but only as its embed text (not verified in Obsidian)",
        actual.includes("ANNOT008") && actual.includes("![[synthetic-figure.png]]"));

  check("annotation with a comment but no text or image is omitted",
        !actual.includes("ANNOT009") && !actual.includes("comment-only"));

  // Portable links: PDF links must use zotero:// backlinks, never machine-specific paths.
  const templateDir = path.join(root, "templates");
  const templateText = fs.readdirSync(templateDir)
    .map(file => fs.readFileSync(path.join(templateDir, file), "utf8")).join("\n");
  check("templates use Zotero backlinks, not machine-specific file links",
        /attachment\.backlink/.test(templateText) && !/\.fileLink|file:\/\//.test(templateText));

  const fixtureText = listMarkdown(vault)
    .map(file => fs.readFileSync(file, "utf8")).join("\n");
  check("sample notes contain no machine-specific file:// links",
        !/file:\/\//.test(fixtureText));

  const empty = await render({ collection: "Coursework/NoSuchCollection" });
  check("unknown collection shows empty-state messages only",
        !empty.includes("zotero:") && (empty.match(/No annotations tagged/g) || []).length === 7);

  const missing = await render({});
  check("missing collection setting shows a prompt",
        missing.startsWith("Specify a Zotero collection path"));

  const failed = results.filter(ok => !ok).length;
  console.log(`\n${results.length - failed} of ${results.length} checks passed.`);
  process.exit(failed ? 1 : 0);
})().catch(error => { console.error(error); process.exit(1); });
