# Fruity Weed client preview

A responsive HTML, Bootstrap, CSS, and JavaScript prototype for Fruity Weed.

## Local preview

Open `landing-prototype/dist/index.html`, or run:

```sh
node landing-prototype/preview.mjs
```

The local server runs at http://127.0.0.1:5173.

## GitHub Pages

Repository: https://github.com/Raulosino/raulosino

In the repository, open **Settings → Pages → Build and deployment**, and select **GitHub Actions** as the source. Pushes to `main` then deploy `landing-prototype/dist` using `.github/workflows/pages.yml`.

Expected website address after a successful deployment: https://raulosino.github.io/raulosino/

Product links lead to the existing shop. Wishlist selections are local to this prototype. This preview does not process orders or payments.
