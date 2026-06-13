import json

with open('src/content/content.json', 'r', encoding='utf-8') as f:
    raw = f.read()

data = json.loads(raw)

# Replace photo with path
data['es']['home']['contact']['photo'] = '/images/profile.jpg'
data['en']['home']['contact']['photo'] = '/images/profile.jpg'

# Replace CVs
data['es']['home']['contact']['cvUrl'] = '/cv/cv-es.pdf'
data['en']['home']['contact']['cvUrl'] = '/cv/cv-en.pdf'

# Replace project image
for proj in data.get('projects', []):
    if proj.get('id') == 'portfolio' and proj.get('image'):
        proj['image'] = '/images/projects/portfolio.png'

with open('src/content/content.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write('\n')

print('content.json updated')
