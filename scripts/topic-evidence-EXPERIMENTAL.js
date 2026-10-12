// DataviewJS reusable topic view for ZotLit annotations.
// Save in the vault as: 00 Dashboard/Scripts/topic-evidence.js
// Each annotation must have both the research category tag and the topic tag.
// Only existing notes in 01 Sources are considered.

const topic = String(input?.topic ?? "").trim().toLowerCase();
const category = String(input?.category ?? "Theory").trim().toLowerCase();

if (!topic) {
  dv.paragraph("Specify a topic in the topic-evidence view.");
} else {
  const results = [];
  const seen = new Set();

  for (const source of dv.pages('"01 Sources"')) {
    const content = await dv.io.load(source.file.path);
    if (!content) continue;

    const blocks = content.split(/(?=^>\s*\[!note\])/m);
    for (const block of blocks) {
      if (!/^>\s*\[!note\]/m.test(block)) continue;
      const tagLine = block.match(/\*\*Category:\*\*\s*([^\n]+)/i);
      if (!tagLine) continue;
      const tags = tagLine[1].replace(/\s*>\s*$/, "")
        .split(",").map(tag => tag.trim().toLowerCase());
      if (!tags.includes(topic) || !tags.includes(category)) continue;

      const page = block.match(/\[Page\s+([^\]]+)\]\((zotero:[^)]+)\)/);
      const passage = block.match(
        /\[Page\s+[^\]]+\]\(zotero:[^)]+\)\s*([\s\S]*?)(?=\*\*Category:\*\*|$)/i
      );
      if (!passage) continue;

      const text = passage[1].replace(/^>\s?/gm, "").trim();
      if (!text) continue;
      const key = JSON.stringify([source.file.path, page?.[2] ?? "", text]);
      if (seen.has(key)) continue;
      seen.add(key);

      const authorYear = String(source.citation ?? source.file.name);
      const citation = page
        ? `[${authorYear}, p. ${page[1]}](${page[2]})`
        : authorYear;
      results.push({ authorYear, citation, text });
    }
  }

  results.sort((a, b) => a.authorYear.localeCompare(b.authorYear));
  if (!results.length) {
    dv.paragraph("*No active source annotations have both of the requested tags.*");
  } else {
    for (const item of results) {
      dv.paragraph(`**${item.citation}** — ${item.text}`);
    }
  }
}
