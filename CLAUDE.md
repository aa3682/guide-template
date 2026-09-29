# [TOPIC] guide — repo instructions

## Starting a new guide from this template
Replace every token below, then edit every file in the list. Tokens are bracketed and all caps, so `grep -rn '\[[A-Z ]\+\]' --exclude-dir=node_modules --exclude-dir=.next .` shows what is left.

Tokens:
- `[TOPIC]` — the subject of the guide as it reads in a sentence ("personal budgeting", "residential wiring").
- `[PROCESS NAME]` — the name of the step-by-step process the guide is organized around; it is also the title of the process section.
- `[AREA LABEL]` — the name of one knowledge area; the domains landing page and the figures page repeat it once per area.
- `[AUTHOR LINE]` — how the author is described on /about, without a personal name, employer, credential, or license.
- `[DISCLAIMER]` — the standard disclaimer, three or four sentences, that sits in a Callout on each section landing page and as plain prose on /about.

Files to edit:
- `CLAUDE.md` — the tokens above, the step and area names under Structure, the Go deeper sources, and the Glossary running list as pages are written.
- `README.md` — the title, the opening description, and the repository URL.
- `package.json` — `name`.
- `app/layout.jsx` — the site title, description, and `REPO_URL`.
- `app/layout.jsx`, `app/globals.css` and `code-theme.mjs` — the accent (`<Head color>` in layout.jsx, plus the accent hex values in globals.css and the code theme), if a different one is wanted. Re-measure the WCAG fixes in globals.css and the code-theme colours after any colour change.
- `content/_meta.js`, `content/process/_meta.js`, `content/domains/_meta.js`, `content/tools/_meta.js` — sidebar labels and order.
- `content/introduction/index.mdx`, `content/process/index.mdx`, `content/domains/index.mdx`, `content/tools/index.mdx` — the landing pages; list every step, area, and tool.
- `content/about/index.mdx` — `[AUTHOR LINE]`, `[DISCLAIMER]`, the corrections URL, and the license links.
- `content/glossary/index.mdx` — delete the example term when the first real term is added.
- `content/process/example-step/index.mdx` — copy it into one folder per real step, then delete the example folder and its `_meta.js` entry.
- `content/domains/example-area/index.mdx` — copy it into one folder per real area, then delete the example folder and its `_meta.js` entry.
- `content/tools/this-years-figures/index.mdx` — one H2 per knowledge area; rows are added as figures come up.
- `LICENSE` — the copyright line.

## What this is
An open, public reference site on [TOPIC], built as a Nextra 4 docs site. Visual reference: https://diy-wealth-framework.vercel.app — the slate theme is ported from it; never copy its content.

Audience: the general public first, practitioners second. Write for a smart adult with no background in [TOPIC]; add practitioner depth in clearly marked subsections rather than separate pages.

## Hard rules
1. Never reference any professional certification body, certification mark, licensing exam, official curriculum, or official topic list — anywhere: page copy, titles, slugs, frontmatter, alt text, README, comments, commit messages. No certification acronyms, no "certified" phrasing. Describe concepts in plain language instead.
2. All content is original. No verbatim or lightly paraphrased text from textbooks, study guides, courses, or official publications. When a fact needs support, cite a public primary source (statute, regulation, agency publication, standards document, court decision, peer-reviewed paper) with a link.
3. Content is educational, not individualized advice. The standard disclaimer lives on each section landing page only (introduction, process, domains, tools). Do not repeat it on individual pages.
4. Do not invent statistics, thresholds, limits, or rates. If a number is year-specific, state the year and cite the source. If unsure, write "[VERIFY]" inline and list it in the report. On knowledge-area pages the figures rule in the area template takes precedence: the number goes on /tools/this-years-figures, not on the page.
5. No personal data, no real client examples. Worked examples use obviously fictional people.
6. Slate theme, dark only. The site uses the slate theme defined in app/globals.css, with its accent, page colour and forced dark mode set through documented Nextra props in app/layout.jsx. There is no light theme and no theme switch. Custom CSS is limited to that theme plus WCAG 2.2 AA fixes; each fix cites its SC number and measured ratio in a comment and is kept as small as possible. No custom components unless the owner asks.

## Attribution and license
- The guide is published under a project name, not a personal name. The site names no personal name, employer, credentials, or licenses anywhere, on pages or in metadata. Its author is described only by [AUTHOR LINE].
- Prose is CC BY 4.0 and code is MIT. This is stated on /about and in README.
- The About page carries one sentence of the landing-page disclaimer as plain prose, not the full Callout. This is intentional.

## Structure
Top-level sections, in this sidebar order:
1. introduction
2. process — the steps of [PROCESS NAME], one folder per step
3. domains — the knowledge areas, one folder per area
4. tools — calculators, checklists, worksheets
5. glossary
6. about

Step and area names are provided by the owner in prompts; do not rename or reorder them. Slugs are lowercase-kebab-case and match the folder name.

## Stack
- Nextra 4, nextra-theme-docs, Next.js App Router, MDX in content/
- pnpm only. Never use npm or yarn.
- Keep the build warning-free.
- Custom CSS and custom components follow hard rule 6, including its WCAG 2.2 AA exception.

## Writing style
- Plain English, short paragraphs, active voice. Define a term the first time it appears and link it to the glossary.
- Landing pages and any page outside content/process/ and content/domains/: one H1, a two-sentence summary under it, then H2 sections. End with a "Related" list linking to 2–4 other pages. Pages under those two folders follow the Page templates section instead: the opening paragraph replaces the summary, and the cross-link sections replace the Related list.
- Use Nextra callouts sparingly: one "Note" or "Warning" per page at most.
- Tables for comparisons; bullet lists for steps; prose for explanation.

## Page templates
Two fixed skeletons. Every page under process/ uses the step skeleton. Every page under domains/ (the knowledge areas) uses the area skeleton. Write the sections in the order given; do not add, remove, or reorder them.
Every step page lives at `content/process/<slug>/index.mdx` and every knowledge-area page at `content/domains/<slug>/index.mdx`, one folder per page, matching the existing scaffold. `content/process/example-step/index.mdx` and `content/domains/example-area/index.mdx` show each skeleton with a one-line instruction in place of every sentence.

Step page skeleton:
1. Frontmatter with `title` and `description`. The description is one sentence, plain language.
2. H1 matching the frontmatter title.
3. Opening paragraph, no heading: what this step is, in plain words.
4. "Why it matters"
5. "What actually happens" — 3–5 short H3 subsections describing the concrete work.
6. "Questions to ask yourself"
7. "Common mistakes"
8. "Which knowledge areas apply" — links to 2–4 area pages, one line each on why it applies at this step.
9. "For practitioners" — a Callout, 3–6 sentences: what you are doing with the client at this step and what to document.
10. "Next step" — one link to the following step page. The last step links back to the first.

Area page skeleton:
1. Frontmatter with `title` and `description`.
2. H1 matching the frontmatter title.
3. Opening paragraph, no heading.
4. "Key ideas" — 4–7 H3 subsections, one concept each.
5. "Where it shows up in the process" — links to the relevant step pages.
6. "Common misconceptions"
7. "For practitioners" — a Callout, same treatment as above.
8. "Go deeper" — 2–6 links, prefer fewer, to public primary sources: statutes and regulations, agency publications, standards bodies, and academic papers cited by DOI. Fill in the topic's own sources here, naming the specific agencies and bodies the guide relies on.

Conventions for both:
- 700–1,000 words. Word count means body prose only — headings, tables, the Callout title, and Go deeper link titles are excluded.
- Measure with pnpm wordcount <path>.
- Second person, plain English. No jargon without a one-line explanation.
- Headings are plain nouns or short questions. H2 for the numbered sections above, H3 within them.
- No disclaimer on individual pages; it lives on the landing pages only.
- Area pages never print yearly-changing figures — limits, thresholds, rates, deadlines. Where a figure is relevant, name the concept in plain language and link to /tools/this-years-figures (for example: 'up to the yearly limit — see this year's figures'). That page holds every number with its year and primary source and is updated once a year. Every 'Go deeper' link must be fetched and confirmed live before the PR is opened; any link that cannot be confirmed is marked [VERIFY] in the report. The rule covers figures set by law, regulation, or an agency. Round hypothetical numbers in a worked example ('200 units a month for ten years') are fine and encouraged.
- Links to the U.S. Code use the granuleid form: https://uscode.house.gov/view.xhtml?req=granuleid%3AUSC-prelim-titleNN-sectionNNNN&num=0&edition=prelim (substitute the title and section). The "title:NN section:NNN" form is not used.
- Row schema on /tools/this-years-figures: one figure per row, columns Concept | What it governs | Value | Year | Source, grouped under one H2 per knowledge area with a stable id (`## [AREA LABEL] [#slug]`) in the site's order. A figure appears once, under the area it fits best. Every Value comes from a fetched primary source or reads VERIFY; never fill a Value from memory.
- Figures that vary by state: Value reads "Varies by state", Year is blank, and Source links a federal locator page if one exists or otherwise names the state office in plain text ("Your state's licensing board"). Never build a per-state table.
- Figures fixed by statute that do not change yearly still get a row: Year reads "Set by statute" and Source links the statute or the agency page.
- Internal links use the site's existing slugs. Check the actual paths under content/ before writing a link.
- The Callout is the stock component from nextra/components, the same one the landing pages use. Import it with exactly this line: `import { Callout } from 'nextra/components'`
- The hard rules and writing style above apply in full to page bodies, headings, and frontmatter, including titles, descriptions, and slugs.

Worksheet page (tools):
- Path: `content/tools/<slug>/index.mdx`, one folder per page.
- 700–1,000 words of body prose, tables excluded. Measure with pnpm wordcount <path>.
- Second person, plain English.
- H2 sections in this order, headings only: "What this measures", "Before you start", first input section, second input section, "The result", "What the number does and does not tell you", "What to do with it", "For practitioners" (Callout), then Related.
- Input section names are worksheet-specific: name each for the two things the worksheet gathers.
- Checklists use the same skeleton with the input sections named "Goals to consider" / "Your goals" and "The result" renamed "Your short list".
- Tables have three columns at most so they render on a phone without horizontal scrolling.
- No regulated figures. Name the concept and link the matching section of /tools/this-years-figures.
- "For practitioners" is a Callout and comes last, followed only by the Related list.
- No disclaimer.
- Example values in tables and worked examples are round hypothetical numbers.

## How to work
- Do exactly what the prompt asks. Do not add sections, pages, or features that were not requested.
- Commit after each completed prompt with a one-line message describing the change. Never push unless the prompt says to push.
- Never delete or rewrite existing content pages unless the prompt names the file.
- End every task with a "Report" section: what was created or changed (file paths), anything marked [VERIFY], anything you were unsure about, and the exact command to view the result.
- Do only what the current prompt asks. Do not act on your own follow-up suggestions, and do not edit files outside the scope of the prompt, even to fix something you notice. List anything you would have done under a "Suggested follow-ups" heading at the end of your report and in the PR description, and leave it there.

## Glossary
One page at /glossary, alphabetical. Every term is an H3 with an explicit id: `### Term [#term-id]`. The id is the term in lowercase, spaces and slashes replaced with hyphens, all other punctuation dropped, no leading or trailing hyphens. Definitions are 1 to 3 sentences with no regulated figures; where a term turns on one, link the matching section of /tools/this-years-figures by anchor. Same-page cross-references (`[other term](#other-term-id)`) are allowed sparingly.
Links to glossary terms from any page use the anchor form /glossary#term-id; a plural link text maps to the singular term's id.

## Glossary running list
Every term that any page links to /glossary. Add a term here when a new page links it. Future prompts reference this list instead of restating it.

