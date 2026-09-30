# guide-template

Reusable starter for an open, public knowledge site built on Nextra 4 — process-first structure, plain-English section names, one reference page for regulated figures, and a CLAUDE.md that drives content through Claude Code.

## What this is

A topic-neutral copy of a working guide site with the subject matter removed. It keeps the six-section layout (introduction, process, knowledge areas, tools, glossary, about), one example step page and one example area page as skeletons, an empty yearly-figures page, and the conventions in `CLAUDE.md` that shape every page. Anything specific to a topic is a bracketed all-caps token.

## Stack

- [Nextra](https://nextra.site) 4 with `nextra-theme-docs`, restyled with a slate theme (dark only) in `app/globals.css`
- A slate code-highlighting theme in `code-theme.mjs`, passed to Nextra in `next.config.mjs`
- [Outfit](https://github.com/Outfitio/Outfit-Fonts), self-hosted from `fonts/` with `next/font/local`
- Next.js App Router
- MDX content in `content/`
- [Pagefind](https://pagefind.app) search index generated at build time
- [Playwright](https://playwright.dev) (dev only), for `pnpm theme-audit`
- pnpm as the only package manager

## Starting a new guide

Replace every token, then edit every file in the list. A grep for `\[[A-Z ]\+\]` (excluding `node_modules` and `.next`) shows what is left.

Tokens:

- `[TOPIC]` — the subject of the guide as it reads in a sentence.
- `[PROCESS NAME]` — the name of the step-by-step process the guide is organized around; also the title of the process section.
- `[AREA LABEL]` — the name of one knowledge area; repeated once per area on the domains landing page and the figures page.
- `[AUTHOR LINE]` — how the author is described on the About page, without a personal name, employer, credential, or license.
- `[DISCLAIMER]` — the standard disclaimer that sits in a Callout on each section landing page and as plain prose on the About page.

Files to edit:

- `CLAUDE.md` — the tokens, the step and area names under Structure, the Go deeper sources, and the Glossary running list as pages are written.
- `README.md` — the title, the opening description, and the repository URL.
- `package.json` — `name`.
- `app/layout.jsx` — the site title, description, and `REPO_URL`.
- `app/layout.jsx`, `app/globals.css` and `code-theme.mjs` — the accent (`<Head color>` in layout.jsx, plus the accent hex values in globals.css and the code theme), if a different one is wanted. Run `pnpm theme-audit` after any colour change.
- `content/_meta.js`, `content/process/_meta.js`, `content/domains/_meta.js`, `content/tools/_meta.js` — sidebar labels and order.
- `content/introduction/index.mdx`, `content/process/index.mdx`, `content/domains/index.mdx`, `content/tools/index.mdx` — the landing pages; list every step, area, and tool.
- `content/about/index.mdx` — `[AUTHOR LINE]`, `[DISCLAIMER]`, the corrections URL, and the license links.
- `content/glossary/index.mdx` — delete the example term when the first real term is added.
- `content/process/example-step/index.mdx` — copy it into one folder per real step, then delete the example folder and its `_meta.js` entry.
- `content/domains/example-area/index.mdx` — copy it into one folder per real area, then delete the example folder and its `_meta.js` entry.
- `content/tools/this-years-figures/index.mdx` — one H2 per knowledge area; rows are added as figures come up.
- `LICENSE` — the copyright line.

## Run locally

Requires Node.js 20.9 or later (`.nvmrc` pins 22) and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Build

```sh
pnpm build
pnpm start
```

`pnpm build` also generates the search index (Pagefind) into `public/_pagefind`.

On Vercel, set `VERCEL_DEEP_CLONE=true` (Production and Preview) in each project's environment variables. Without it Vercel clones the repository shallowly and Nextra warns "repository is shallow cloned" during the build.

`pnpm theme-audit [url]` re-checks the theme in a running build (`pnpm start`, default http://localhost:3000): dark mode forced, no theme switch, no neutral greys, text contrast and focus rings, on every sidebar page at 1280px and 390px. Run it after a Nextra upgrade or any colour change. The first run on a new machine needs `pnpm exec playwright install chromium`.

`pnpm wordcount <path>` counts the body prose of a content page, following the word-count rules in `CLAUDE.md`.

## License

The prose in `content/` is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The code is licensed under MIT (see `LICENSE`). The Outfit font in `fonts/` is licensed under the SIL Open Font License 1.1 (see `fonts/OFL.txt`).
