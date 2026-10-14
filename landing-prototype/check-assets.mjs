import fs from 'node:fs';
import vm from 'node:vm';
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('dist/products.js', 'utf8'), context);
const products = context.window.carouselProducts;
if (products.length < 12) throw new Error('Carousel needs at least 12 image cards');
for (const product of products) {
  if (!fs.existsSync('dist/' + product.image)) throw new Error(`Missing image: ${product.image}`);
  if (!product.url.startsWith('https://www.fruityweed.de/shop/')) throw new Error('Unexpected product URL');
}
const html = fs.readFileSync('dist/index.html', 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:css|js|png))"/g)) {
  if (!match[1].startsWith('https:') && !fs.existsSync('dist/' + match[1])) throw new Error(`Missing asset: ${match[1]}`);
}
console.log(`Verified ${products.length} product image cards and all local page assets.`);
