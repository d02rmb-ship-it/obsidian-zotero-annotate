// Shared DataviewJS view for project evidence collected through ZotLit.
// Save as: 00 Dashboard/Scripts/research-evidence.js
// In a project note:
// await dv.view("00 Dashboard/Scripts/research-evidence", { collection: ".../Literature" });

const collection = input?.collection;
if (!collection || typeof collection !== "string") {
  dv.paragraph("Specify a Zotero collection path in the research-evidence view.");
} else {
  const categories = [
    "Background", "Literature Review", "Theory", "Gap",
    "Method", "Findings", "Contribution"
  ];
  const sections = [...categories, "Unclassified"];
  const evidence = Object.fromEntries(sections.map(name => [name, []]));
  const seen = Object.fromEntries(sections.map(name => [name, new Set()]));

  // Only source notes associated with this project are included.
  // Collection membership comes from note metadata, not live Zotero data.
  const sources = dv.pages('"01 Sources"')
    .where(page => Array.from(page.collections ?? []).includes(collection));

  for (const source of sources) {
    const content = await dv.io.load(source.file.path);
    if (!content) continue;

    // ZotLit's annotation template uses > [!note] for each annotation.
    // The same highlight can occur in multiple source-note category sections.
    const blocks = content.split(/(?=^>\s*\[!note\])/m);
    for (const block of blocks) {
      if (!/^>\s*\[!note\]/m.test(block)) continue;

      const page = block.match(/\[Page\s+([^\]]+)\]\((zotero:[^)]+)\)/i);
      if (!page) continue; // Skip text that is not an annotation block.

      const categoryMatch = block.match(/^>\s*\*\*Category:\*\*\s*([^\n]*)/mi);
      const tags = categoryMatch
        ? categoryMatch[1].split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean)
        : [];
      const matchedCategories = categories.filter(category => tags.includes(category.toLowerCase()));
      const targetCategories = matchedCategories.length ? matchedCategories : ["Unclassified"];

      // Get the excerpt after the page link, stopping before category/comment metadata.
      const afterPage = block.slice(block.indexOf(page[0]) + page[0].length);
      const excerpt = afterPage.split(/\n>\s*\*\*(?:Category|My comment):\*\*/i)[0]
        .replace(/^>\s?/gm, "")
        .trim();
      if (!excerpt) continue;

      const authorYear = String(source.citation ?? source.file.name);
      const citation = `[${authorYear}, p. ${page[1]}](${page[2]})`;
      // Use source + annotation link + text to identify duplicate renditions.
      const key = JSON.stringify([source.file.path, page[2], excerpt]);

      for (const category of targetCategories) {
        if (seen[category].has(key)) continue;
        seen[category].add(key);
        evidence[category].push({ citation, text: excerpt, authorYear });
      }
    }
  }

  for (const category of sections) {
    dv.header(3, category);
    const annotations = evidence[category]
      .sort((a, b) => a.authorYear.localeCompare(b.authorYear));
    if (!annotations.length) {
      dv.paragraph(category === "Unclassified"
        ? "*No unclassified annotations.*"
        : "*No annotations tagged for this category.*");
      continue;
    }
    for (const annotation of annotations) {
      dv.paragraph(`**${annotation.citation}** — ${annotation.text}`);
    }
  }
}
