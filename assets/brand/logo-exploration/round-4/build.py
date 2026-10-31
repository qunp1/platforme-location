from pathlib import Path
import re

R=Path(__file__).resolve().parent
R.mkdir(exist_ok=True)
original=(R.parent/'round-3/b-v1-symbol.svg').read_text()
original=re.search(r'<g fill="[^"]+">(.*)</g>',original).group(1)

# Same idea throughout: pointed entrance + front-facing car.
# V2: soften the pointed top, open the roof counter and use wide headlamps.
v2='''<path fill-rule="evenodd" d="M32 216V116C32 73 69 46 119 20Q128 15 137 20C187 46 224 73 224 116V216H196V194H60V216ZM79 78H177Q156 60 128 46Q100 60 79 78ZM62 142H194L183 113Q180 104 169 104H87Q76 104 73 113ZM66 158V174H95Q101 174 101 168V164Q101 158 95 158ZM161 158Q155 158 155 164V168Q155 174 161 174H190V158Z"/>'''
# V3: the window follows the entrance; remove the separate triangle entirely.
v3='''<path fill-rule="evenodd" d="M36 216V120C36 73 77 45 128 18C179 45 220 73 220 120V216H192V194H64V216ZM65 139H191V119C191 90 165 70 128 50C91 70 65 90 65 119ZM79 158A10 10 0 1 0 79 178A10 10 0 1 0 79 158ZM177 158A10 10 0 1 0 177 178A10 10 0 1 0 177 158Z"/>'''
# V4: distinct arch and car, with a broad negative gap and a compact vehicle.
v4='''<path d="M24 216V117C24 66 70 39 128 10C186 39 232 66 232 117V216H208V118C208 83 177 62 128 37C79 62 48 83 48 118V216Z"/><path fill-rule="evenodd" d="M62 206V154Q62 145 68 132L78 112Q83 103 94 103H162Q173 103 178 112L188 132Q194 145 194 154V206H172V192H84V206ZM84 143H172L163 123H93ZM88 158A9 9 0 1 0 88 176A9 9 0 1 0 88 158ZM168 158A9 9 0 1 0 168 176A9 9 0 1 0 168 158Z"/>'''
items=[('B1','The starting point',original,'The version you chose, kept for comparison.','Crisp peak / round lights / compact car'),('B2','Softer arrival',v2,'A softened peak and wider car headlights.','Warmer outline / more recognisable car front'),('B3','One continuous arch',v3,'The entrance itself becomes the windscreen.','Simpler silhouette / strongest at small sizes'),('B4','An open welcome',v4,'A compact car sits within a lighter entrance.','More breathing room / clearer separate forms')]
old=(R.parent/'round-2/a-v2-lockup.svg').read_text()
word=old[old.index('<g transform="translate(244'):].split('</g></g></svg>')[0]
word=re.sub(r'<g transform="translate\(244 66\) scale\(1.05\)">','<g>',word)+'</g>'
def svg(body,box='0 0 256 256'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img"><title>Nadorly arrival gate exploration</title><g fill="#151515">{body}</g></svg>'
def embed(body,x,y,size,color='#151515'):
    return f'<g transform="translate({x} {y}) scale({size/256})" fill="{color}">{body}</g>'
for code,name,b,desc,detail in items:
    (R/f'{code.lower()}-v1-symbol.svg').write_text(svg(b))
    (R/f'{code.lower()}-v1-lockup.svg').write_text(svg(f'{embed(b,0,0,230)}<g transform="translate(258 71) scale(1.05)">{word}</g>','0 0 800 256'))
p=['<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1500" viewBox="0 0 1440 1500"><rect width="1440" height="1500" fill="#f4f1e9"/><g font-family="Segoe UI,Arial,sans-serif" fill="#17201b">', '<text x="56" y="58" font-size="17" letter-spacing="3">NADORLY / DEVELOPING THE ARRIVAL GATE</text>', '<text x="56" y="119" font-size="42" font-weight="600">One direction. Four expressions.</text>', '<text x="56" y="160" font-size="20" fill="#687068">Exploration only — shape first; colour and lettering remain open.</text>']
for i,(code,name,b,desc,detail) in enumerate(items):
    x=48+(i%2)*680;y=200+(i//2)*568
    p.append(f'<rect x="{x}" y="{y}" width="664" height="548" rx="3" fill="#fff"/>')
    p.append(f'<text x="{x+28}" y="{y+44}" font-size="19" font-weight="600">{code} / {name}</text>')
    p.append(embed(b,x+197,y+66,270))
    p.append(f'<g transform="translate({x+207} {y+351}) scale(.51)" fill="#151515">{word}</g>')
    p.append(f'<text x="{x+28}" y="{y+444}" font-size="18" fill="#515d54">{desc}</text>')
    p.append(f'<text x="{x+28}" y="{y+472}" font-size="16" fill="#7a817a">{detail}</text>')
    for size,xx in [(32,x+32),(24,x+98),(16,x+158)]:
        p.append(embed(b,xx,y+491,size))
        p.append(f'<text x="{xx+size+7}" y="{y+513}" font-size="10" fill="#7a817a">{size}</text>')
    p.append(f'<rect x="{x+565}" y="{y+482}" width="68" height="52" rx="5" fill="#17201b"/>')
    p.append(embed(b,x+575,y+484,48,'#fff'))
p.append('<rect x="48" y="1356" width="1344" height="104" fill="#315f53"/>')
p.append(embed(v2,72,1367,86,'#f9f4e7'))
p.append(f'<g transform="translate(184 1388) scale(.36)" fill="#f9f4e7">{word}</g>')
p.append('<text x="570" y="1394" font-size="21" fill="#f9f4e7">My pick: B2 for warmth and a clearer car.</text><text x="570" y="1429" font-size="18" fill="#d4ded7">B3 is the cleaner alternative if simplicity matters most.</text></g></svg>')
(R/'nadorly-arrival-variants-v1.svg').write_text(''.join(p))
t=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><rect width="1200" height="760" fill="#eee"/>']
for i,(code,name,b,desc,detail) in enumerate(items):
    y=12+i*186
    t.append(f'<rect x="12" y="{y}" width="1176" height="174" fill="#fff"/>')
    t.append(embed(b,32,y+9,152))
    t.append(f'<g transform="translate(208 {y+56}) scale(.6)" fill="#151515">{word}</g>')
    t.append(f'<rect x="570" y="{y+12}" width="148" height="148" fill="#151515"/>')
    t.append(embed(b,582,y+24,124,'#fff'))
    for size,xx in [(64,756),(32,866),(24,954),(16,1040)]:t.append(embed(b,xx,y+60,size))
    t.append(f'<g transform="translate(1158 {y+61}) scale(-.25 .25)" fill="#151515">{b}</g>')
t.append('</svg>')
(R/'checks-v1.svg').write_text(''.join(t))
(R/'README.md').write_text('''# Nadorly — arrival gate variants\n\nConcepts, not an approved final identity. The user chose round-three B as the\nstarting direction and requested close variants before deciding.\n\nB1 preserves the chosen drawing. B2 softens the apex, enlarges the upper opening\nand gives the car horizontal headlights. B3 merges the arch and windscreen,\nremoving the triangular opening. B4 separates the vehicle and frame.\n\nRecommendation: B2 for a more car-like front; B3 for simplicity. B3 risks\nreading as a bus or train; B4's gaps and headlights need a simplified 16px cut.\nAll retain the risk of architectural or transport-service associations.\n\nWordmark is the earlier exploratory outlined lettering, held constant to compare\nsymbols. Green is a provisional colour preview, not a selected palette.\nNo new trademark clearance performed in this iteration.\n''')
