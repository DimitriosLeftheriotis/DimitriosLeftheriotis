# Dimitrios Leftheriotis — Portfolio

A dependency-free academic and engineering portfolio built with semantic HTML, responsive CSS, and vanilla JavaScript. It is designed to publish directly through GitHub Pages with no build step and no runtime dependencies.

## Project files

- `index.html` — page content and metadata
- `styles.css` — visual system, responsive layouts, and accessible motion
- `script.js` — progressive navigation and reveal enhancements
- `Biography.pdf` — downloadable profile document
- `Biography.md` — source biography
- `tests/site.test.mjs` — dependency-free static contract tests
- `.nojekyll` — disables unnecessary Jekyll processing

## Preview locally

The files can be opened directly, but serving them over HTTP more closely matches GitHub Pages. From this directory, run one of these commands in a terminal:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. Stop the server with `Ctrl+C`.

## Run tests

Node.js is only needed for the optional development tests; the website itself does not require Node.js.

```powershell
node --test tests/site.test.mjs
```

## Publish with GitHub Pages

1. Create or open the target GitHub repository.
2. Commit these files at the repository root and push them to the default branch.
3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the default branch and the `/(root)` folder, then click **Save**.
6. When GitHub reports that deployment is complete, open the displayed Pages URL.

All local file references are relative, so the site works for both account sites and project sites. No GitHub Actions workflow is required.

## Update content

Most content is plain text in `index.html`. To add another completed project, copy the existing `.project-card`, give it the next sequential index, and replace its title, verified description, technology tags, repository URL, and accessible link label. Only publish details and links that are ready.

When replacing the downloadable document, either retain the filename `Biography.pdf` or update both PDF links in `index.html`. Run the tests after changing filenames, navigation targets, or contact links.

## Accessibility

The page uses semantic landmarks, a skip link, visible focus indicators, keyboard-operable navigation, and reduced-motion support. JavaScript is an enhancement: all portfolio content and links remain available when it is disabled.
