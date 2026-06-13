import json, base64, os

with open('src/content/content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

os.makedirs('public/images/projects', exist_ok=True)

for proj in data.get('projects', []):
    img = proj.get('image', '')
    pid = proj.get('id', 'unknown')
    if img and ',' in img:
        b64 = img.split(',', 1)[1]
        ext = 'png' if 'png' in img[:50] else 'jpg'
        fname = f'public/images/projects/{pid}.{ext}'
        with open(fname, 'wb') as f:
            f.write(base64.b64decode(b64))
        print(f'saved {fname}')
    else:
        print(f'project {pid}: no image')

print('Done')
