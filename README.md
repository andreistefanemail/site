# YourStudio website

Custom agency site: plain HTML, CSS and JavaScript, with no build step and no template.

## Files
- `index.html`: **Romanian** version (the main page, at `yourstudio.ro/`)
- `en/index.html`: **English** version (at `yourstudio.ro/en/`)

Both pages share the same design and script. When you change content (projects, prices, contact),
**edit both files**. The RO/EN switch in the top bar links the two pages.
- `styles.css`: design. Change brand colors and fonts in `:root` at the top.
- `script.js`: menu, scroll animations, portfolio filters, contact form

## Things to replace
1. **Name:** search for `YourStudio` (in index.html and script.js) and replace it.
2. **Projects:** in the `WORK` section, set each `href` to your sample site's link and update the title and category.
   To show a screenshot, put `img/project1.jpg` in an `img` folder and replace the `<span>` inside `.work__img` with
   `<img src="img/project1.jpg" alt="Project name">`.
   Categories: `food`, `services`, `shop` (the filter buttons use these).
3. **Prices:** replace `€XXX` / `€XX`.
4. **Contact:** email, phone and Instagram in the `CONTACT` section, plus `CONTACT_EMAIL` in script.js.
5. **Testimonials:** add real client quotes when you have them.

## Contact form (GitHub Pages can't process forms)
1. Create a free form at https://formspree.io
2. Copy your form ID and replace `YOUR_FORM_ID` in index.html.
Until then, the form opens the visitor's email app with the message filled in.

## Deploy to GitHub Pages
1. Create a new repo, e.g. `yourstudio-site`, and upload these files to it.
2. Go to repo **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. The site goes live at `https://<username>.github.io/yourstudio-site/`.

### Custom domain (recommended for an agency)
1. Buy a domain (e.g. `yourstudio.ro`).
2. In **Settings → Pages → Custom domain**, enter it. GitHub creates a `CNAME` file for you.
3. At your domain registrar, add DNS records:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `<username>.github.io`
4. Tick **Enforce HTTPS** once it's available.
