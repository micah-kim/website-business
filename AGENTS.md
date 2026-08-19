# Agent guide - Foundry marketing site

Note: `CLAUDE.md` is a symlink to this file. Edit `AGENTS.md` only. Do not
replace the symlink with a copy, because the two files must not drift.

## What this repo is

Foundry is a one-page marketing site for a web design side business. The
customers are clothing resellers, artists, and independent sellers.

The site is static. There is no build step, no package manager, and no
dependencies. Every file ships to the web exactly as it is in git.

## Layout

| Path | Content |
|---|---|
| `index.html` | All page content, all sections, and the JSON-LD blocks |
| `css/styles.css` | The design system and all layout |
| `js/main.js` | The mobile nav toggle, the Work previews, and the contact form mailto link |
| `work/` | Three standalone concept sites. See "The concept sites" below |
| `assets/` | The favicon, the apple touch icon, and the Open Graph image |
| `favicon.ico` | Root icon for clients that request `/favicon.ico` |
| `robots.txt`, `sitemap.xml` | Crawler files |
| `.gnhf/` | Logs from an agent run. Do not read them and do not edit them |

`index.html` has these sections in order: hero, trustbar, `#services`,
`#work`, `#about`, `#process`, `#compare`, `#pricing`, `#faq`, `#contact`.

## How to run the site

To serve the folder, run this command. Then open `http://localhost:8000`.

```
python3 -m http.server 8000
```

You can also open `index.html` in a browser directly.

## Rules for changes

Keep the site dependency free. Do not add a framework, a bundler, a CSS
preprocessor, or an npm package.

Write plain HTML, plain CSS, and plain JavaScript. The JavaScript must run in
the browser without a transpile step.

Use the CSS custom properties in the `:root` block of `css/styles.css`. Do not
write a raw hex color in a rule. Add a new token if no token fits.

Obey the color rule at the top of `css/styles.css`. The pastel tokens are for
surfaces only. Text color and interactive color must come from
`--color-ink`, `--color-ink-soft`, `--color-accent`, or `--color-accent-ink`.

Check every new text and background pair against WCAG AA. The current design
meets AA and must stay at AA.

Give decorative markup `aria-hidden="true"`. The browser mockup illustrations
are an example of this.

## The concept sites

`work/` holds three standalone concept sites. They are the proof in the
`#work` section, because Foundry has no client list yet.

| Path | Concept |
|---|---|
| `work/rerun/` | RERUN, a vintage resale storefront |
| `work/studio/` | Marlowe Clay, a ceramicist portfolio |
| `work/second-seam/` | Second Seam, an alterations booking site |

Each concept is one self-contained HTML file with its own `<style>` block.

These three files are the one exception to the CSS rules above. A concept
must not use the Foundry tokens, and it must not share a look with the other
two. Three sites that look alike prove no range. Give each one its own
palette, its own type, and its own layout.

Every text and background pair inside a concept must still meet WCAG AA.

Do not use stock photos in a concept. Draw the product images with inline SVG
and CSS. This keeps the repo free of an image rights problem.

Keep the `concept-banner` element at the top of each concept. It marks the
page as a concept, and it links back to `#contact`. The `#concept-banner`
fragment hides it, which is how the preview iframes get a clean thumbnail.

The `#work` cards frame each concept in a scaled iframe, so a thumbnail
cannot drift from its concept. `js/main.js` holds the scale to the card
width. The static mock behind the iframe is the fallback for when the frame
cannot load.

Add a new concept to `sitemap.xml` at the same time you add it to `work/`.

## Content rules

The placeholder domain is `www.foundry.example` and the placeholder address is
`hello@foundry.example`. Change them in every place at the same time if a real
domain arrives. They appear in `index.html`, `sitemap.xml`, and `robots.txt`.

Keep the two JSON-LD blocks in `index.html` in sync with the page. The
`FAQPage` block must match the questions and the answers in `#faq`. The
`ProfessionalService` block must match the prices in `#pricing`.

Keep the Open Graph title and description the same as the `<title>` and the
meta description.

## How to check a change

There is no test suite. Check a change by hand:

1. Serve the folder and load the page.
2. Look at the changed section at a wide width and at a narrow width.
3. Open the mobile nav. Then close it with a link, with the Escape key, and
   with a click outside it.
4. Submit the contact form. Check that the mailto link holds every field.
5. Check the browser console for errors.

If you changed the `#work` section or a concept site, also do these steps:

1. Check that each preview in `#work` matches its concept site.
2. Open each concept site at a wide width and at a narrow width.
3. Open `index.html` from the file system. Check that the static fallback
   appears when a preview iframe cannot load.

Be picky about the result. Fix a visible layout problem even if it is next to
your change and not caused by it.

## Git

The default branch is `main`. Do not commit the `.gnhf/` directory contents in
a normal change.
