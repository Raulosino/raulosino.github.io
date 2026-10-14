import fs from 'node:fs';
const decode = (value) => value.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&euro;/g, '€');
function extract(file) {
  const html = fs.readFileSync(file, 'utf8');
  return [...html.matchAll(/<h2 class="woocommerce-loop-product__title">([^<]+)/g)].map((match) => {
    const start = html.lastIndexOf('<li ', match.index);
    const block = html.slice(start, html.indexOf('</li>', match.index));
    const anchor = block.match(/<a[^>]*class="[^"]*show_details_button[^>]*>/)?.[0];
    const url = anchor?.match(/href="([^"]+)"/)?.[1];
    const image = block.match(/<img[^>]*src="([^"]+)"/)?.[1];
    const imageUrl = image?.slice(image.lastIndexOf('https://')).split('&')[0];
    const priceBlock = block.match(/<p class="price">([\s\S]*?)<\/p>/)?.[1] ?? '';
    const prices = [...priceBlock.matchAll(/<bdi>([\d.,]+)/g)].map((m) => m[1]);
    return { name: decode(match[1]), url, sourceImage: imageUrl, price: prices.at(-1), oldPrice: prices.length > 1 ? prices[0] : null };
  }).filter((p) => p.url && p.sourceImage && p.price);
}
const home = extract('../fruityweed-inspect.html');
const shop = extract('../shop-inspect.html');
const first = ['Candy Fumez', 'Cannabis Zuckerstrauch', 'Dantes Inferno #8', 'Fresca Melon'];
const selected = first.map((name) => home.find((p) => p.name === name));
for (const product of [...home, ...shop]) {
  if (selected.length >= 12) break;
  if (!selected.some((p) => p.name === product.name)) selected.push(product);
}
if (selected.length !== 12 || selected.some((p) => !p)) throw new Error('Expected 12 sourced products');
const sources = [...new Set(selected.map((p) => p.sourceImage))];
selected.forEach((p) => { p.image = `assets/images/product-${sources.indexOf(p.sourceImage) + 1}.${p.sourceImage.endsWith('.webp') ? 'webp' : 'png'}`; });
fs.writeFileSync('dist/products.js', `window.carouselProducts = ${JSON.stringify(selected.map(({sourceImage, ...p}) => p), null, 2)};\n`);
fs.writeFileSync('content/carousel-image-sources.json', JSON.stringify(sources, null, 2));
console.log(JSON.stringify({ products: selected.map((p) => p.name), images: sources }, null, 2));
