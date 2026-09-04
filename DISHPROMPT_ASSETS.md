# DishPrompt local asset manifest

All replaceable site images live in `client/public/assets/dishprompt-assets/`. Replace a file with your own image while keeping the exact filename, then deploy to Vercel.

| File | Used for | Suggested format |
|---|---|---|
| `logo.png` | Header and footer logo | Transparent PNG, square or horizontal mark |
| `favicon.png` | Browser favicon | Square PNG, 512×512 or larger |
| `og-image.jpg` | Social and WhatsApp preview | JPG, 1200×630 |
| `hero.jpg` | Homepage hero image | JPG, landscape or portrait crop suitable for desktop/mobile |
| `result-paneer-tikka.jpg` | Homepage solution image and Results example 01 | JPG |
| `result-biryani.jpg` | Results example 02 | JPG |
| `result-masala-dosa.jpg` | Results example 03 | JPG |

The frontend references these files with paths beginning `/assets/dishprompt-assets/`. No page-component edits are needed when filenames remain unchanged. Use real, representative restaurant photography for the examples and avoid making a generated image materially misleading.
