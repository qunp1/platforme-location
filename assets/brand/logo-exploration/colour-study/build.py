from pathlib import Path
import re, html, json
R=Path(__file__).resolve().parent
R.mkdir(exist_ok=True)
K=R.parent.parent/'nadorly-kit-v1/svg'
def artwork(name):
    raw=(K/name).read_text(encoding='utf-8')
    return re.search(r'<svg[^>]*>(.*)</svg>',raw).group(1)
symbol=artwork('nadorly-symbol-green.svg')
lockup=artwork('nadorly-horizontal-green.svg')
palettes=[
    ('A','Original green','#315F53','#F9F4E7','#17201B','Welcoming and grounded.','A softer, more heritage-led character.'),
    ('B','Coastal blue','#155F8A','#F7F2E8','#142D3B','Clear, coastal and dependable.','My pick for Nadorly.'),
    ('C','Lagoon teal','#0D6C73','#F5F2E9','#153538','A blue-green middle ground.','A quieter, more boutique character.')]
def emb(b,x,y,w,h,color,box='0 0 256 256'):
    b=b.replace('#315F53',color)
    return f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="{box}">{b}</svg>'
def lum(h):
    vs=[int(h[i:i+2],16)/255 for i in [1,3,5]]
    return sum(a*(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4) for a,v in zip([.2126,.7152,.0722],vs))
p=['<svg xmlns="http://www.w3.org/2000/svg" width="1560" height="1100" viewBox="0 0 1560 1100"><rect width="1560" height="1100" fill="#eeeae3"/><g font-family="Segoe UI,Arial,sans-serif" fill="#202a2b">','<text x="56" y="58" font-size="17" letter-spacing="3">NADORLY / COLOUR EXPLORATION</text>','<text x="56" y="122" font-size="43" font-weight="600">A coastal colour, with a warm welcome.</text>','<text x="56" y="164" font-size="20" fill="#657071">The earlier B2 logo, held constant across three palettes.</text>']
contrasts={}
for i,(code,name,primary,paper,ink,note,detail) in enumerate(palettes):
    x=40+i*508
    p.append(f'<rect x="{x}" y="204" width="492" height="810" fill="{paper}"/>')
    p.append(f'<text x="{x+28}" y="255" font-size="22" font-weight="600" fill="{ink}">{code} / {name}</text>')
    p.append(emb(symbol,x+130,292,232,232,primary))
    p.append(emb(lockup,x+30,548,432,120,primary,'0 0 780 216'))
    p.append(f'<rect x="{x}" y="704" width="492" height="150" fill="{primary}"/>')
    p.append(emb(lockup,x+36,724,420,116,paper,'0 0 780 216'))
    p.append(f'<text x="{x+28}" y="895" font-size="20" fill="{ink}">{note}</text>')
    p.append(f'<text x="{x+28}" y="925" font-size="17" fill="{ink}">{detail}</text>')
    for j,(col,label) in enumerate([(primary,primary),(paper,paper),(ink,ink)]):
        xx=x+28+j*148
        p.append(f'<rect x="{xx}" y="952" width="25" height="25" rx="4" fill="{col}" stroke="#b9c0ba"/><text x="{xx+33}" y="971" font-size="13" fill="{ink}">{label}</text>')
    contrast=(lum(paper)+.05)/(lum(primary)+.05)
    contrasts[code]=round(contrast,2)
    if code!='A':
        for kind in ['symbol','horizontal']:
            raw=(K/f'nadorly-{kind}-green.svg').read_text(encoding='utf-8').replace('#315F53',primary)
            (R/f'nadorly-{kind}-{code.lower()}-preview.svg').write_text(raw,encoding='utf-8')
p.append('<text x="56" y="1062" font-size="17" fill="#657071">Palette proposals only. B2 remains the selected logo direction; the existing kit is preserved.</text></g></svg>')
board=''.join(p)
import xml.etree.ElementTree as ET
ET.fromstring(board)
(R/'nadorly-colours-v1.svg').write_text(board,encoding='utf-8')
(R/'palette-notes.json').write_text(json.dumps({'status':'Colour proposals, not approved','logo':'Earlier B2, Softer arrival','recommendation':'B — Coastal blue','contrast_primary_on_light':contrasts,'palettes':[{'code':a,'name':b,'primary':c,'light':d,'ink':e} for a,b,c,d,e,*_ in palettes]},indent=2))
print('Primary/light contrast ratios:',contrasts)
