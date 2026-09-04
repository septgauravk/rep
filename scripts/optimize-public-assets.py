from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/restaurant-ai-image-research/client/public/assets/dishprompt-assets')
for path in sorted(root.iterdir()):
    if path.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue
    with Image.open(path) as image:
        image = image.convert('RGB')
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        if path.suffix.lower() == '.png' and path.name == 'favicon.png':
            image.thumbnail((512, 512), Image.Resampling.LANCZOS)
            image.save(path, format='PNG', optimize=True)
        elif path.suffix.lower() == '.png':
            image.save(path, format='JPEG', quality=78, optimize=True)
        else:
            image.save(path, format='JPEG', quality=78, optimize=True, progressive=True)
