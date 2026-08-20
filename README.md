# You Need a Website

Marketing site for a web design side business: building websites for
clothing resellers, artists, and independent sellers.

Static site, no build step. Open `index.html` directly or serve the
folder with any static file server, e.g.:

```
python3 -m http.server 8000
```

## Structure

- `index.html` - all page content and sections
- `css/styles.css` - design system (colors, type, spacing) and layout
- `js/main.js` - mobile nav toggle, work previews, contact form submit
- `work/` - three standalone concept sites

## Contact form

The form posts to Web3Forms, which forwards each message to
`micah.kim.hj@gmail.com`. Paste your account key into the one hidden
input in `index.html`:

```
<input type="hidden" name="access_key" value="" />
```

While that value is blank, the form falls back to a prefilled `mailto:`
link, so the button always does something.
