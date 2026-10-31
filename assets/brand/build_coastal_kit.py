from pathlib import Path
import re, json, sys, subprocess, zipfile

BASE=Path(__file__).resolve().parent
PROJECT=BASE.parent.parent
KIT=BASE/'nadorly-kit-v2'
for d in ['svg','png','web','presentation']:(KIT/d).mkdir(parents=True,exist_ok=True)
SKILL=PROJECT/'.agents/skills/logo-design/scripts'
source=(BASE/'logo-exploration/round-4/b2-v1-symbol.svg').read_text()
body=re.search(r'<g fill="[^"]+">(.*)</g>',source).group(1)
old=(BASE/'logo-exploration/round-2/a-v2-lockup.svg').read_text()
word=old[old.index('<g transform="translate(244'):].split('</g></g></svg>')[0]
word=re.sub(r'<g transform="translate\(244 66\) scale\(1.05\)">','<g>',word)+'</g>'
BLUE='#155F8A';IVORY='#F7F2E8';INK='#142D3B'
def svg(b,box,color,title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img" aria-label="{title}"><title>{title}</title><g fill="{color}">{b}</g></svg>'
def put(name,b,box,color):
    (KIT/'svg'/f'nadorly-{name}.svg').write_text(svg(b,box,color,'Nadorly — arrival gate'),encoding='utf-8')
symbol=f'<g transform="translate(0 8)">{body}</g>'
# Larger negative headlights for the 16–24px optical cut.
small=body.replace('M66 158V174H95Q101 174 101 168V164Q101 158 95 158Z','M64 155V178H96Q104 178 104 170V163Q104 155 96 155Z').replace('M161 158Q155 158 155 164V168Q155 174 161 174H190V158Z','M160 155Q152 155 152 163V170Q152 178 160 178H192V155Z')
small=f'<g transform="translate(0 8)">{small}</g>'
# Slightly enlarged negative counters balance light shapes on a dark field.
revbody=body.replace('M79 78H177Q156 60 128 46Q100 60 79 78Z','M76 79H180Q157 59 128 44Q99 59 76 79Z').replace('M62 142H194L183 113Q180 104 169 104H87Q76 104 73 113Z','M60 143H196L184 112Q181 102 169 102H87Q75 102 72 112Z').replace('M66 158V174','M65 157V175').replace('H190V158Z','H191V157Z')
revbody=revbody.replace('M65 157V175H95Q101 174 101 168V164Q101 158 95 158Z','M65 157V175H95Q102 175 102 168V164Q102 157 95 157Z').replace('M161 158Q155 158 155 164V168Q155 174 161 174H191V157Z','M161 157Q154 157 154 164V168Q154 175 161 175H191V157Z')
reverse=f'<g transform="translate(0 8)">{revbody}</g>'
def layouts(sym):
    return {'symbol':(sym,'0 0 256 256'),
      'horizontal':(f'<g transform="translate(0 0) scale(.84)">{sym}</g><g transform="translate(237 58) scale(1.05)">{word}</g>','0 0 780 216'),
      'stacked':(f'<g transform="translate(136 0) scale(.95)">{sym}</g><g transform="translate(27 276) scale(.95)">{word}</g>','0 0 516 410'),
      'wordmark':(f'<g transform="translate(12 12)">{word}</g>','0 0 516 148')}
for variant,color,sym in [('blue',BLUE,symbol),('black','#000000',symbol),('white','#FFFFFF',reverse),('ivory',IVORY,reverse)]:
    for kind,(b,box) in layouts(sym).items():put(f'{kind}-{variant}',b,box,color)
put('symbol-small',small,'0 0 256 256',BLUE)
put('app-icon',f'<rect width="256" height="256" rx="56" fill="{BLUE}"/><g transform="translate(32 32) scale(.75)">{reverse}</g>','0 0 256 256',IVORY)

def emb(b,x,y,size,color):return f'<g transform="translate({x} {y}) scale({size/256})" fill="{color}">{b}</g>'
p=['<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1320" viewBox="0 0 1440 1320"><rect width="1440" height="1320" fill="#F7F2E8"/><g font-family="Segoe UI,Arial,sans-serif" fill="#142D3B">', '<text x="64" y="62" font-size="16" letter-spacing="3">NADORLY / WORKING IDENTITY / VERSION 02</text>', '<text x="64" y="123" font-size="42" font-weight="600">Your arrival. A warm welcome.</text>']
p.append(emb(symbol,92,172,322,BLUE))
p.append(f'<g transform="translate(475 267) scale(1.5)" fill="{BLUE}">{word}</g>')
p.append('<text x="64" y="540" font-size="19" fill="#687068">A pointed entrance and a car, united in one mark. Developed from your selected B2.</text>')
p.append('<rect x="48" y="584" width="660" height="360" fill="#155F8A"/>')
p.append(emb(reverse,92,644,248,IVORY))
p.append(f'<g transform="translate(349 734) scale(.62)" fill="{IVORY}">{word}</g>')
p.append('<text x="78" y="917" font-size="15" fill="#F7F2E8">REVERSED / IVORY ON BLUE</text>')
p.append('<rect x="732" y="584" width="660" height="360" fill="#fff"/>')
p.append(emb(symbol,768,644,248,INK))
p.append(f'<g transform="translate(1025 734) scale(.62)" fill="{INK}">{word}</g>')
p.append('<text x="762" y="917" font-size="15" fill="#687068">ONE COLOUR / INK ON WHITE</text>')
for x,col,name,hx in [(48,BLUE,'Coastal blue',BLUE),(390,IVORY,'Warm ivory',IVORY),(732,INK,'Deep navy',INK)]:
    p.append(f'<rect x="{x}" y="974" width="318" height="88" fill="{col}" stroke="#d8d7ce"/><text x="{x}" y="1094" font-size="20">{name}</text><text x="{x}" y="1122" font-size="16" fill="#687068">{hx}</text>')
p.append('<rect x="1098" y="974" width="128" height="128" rx="28" fill="#155F8A"/>')
p.append(emb(reverse,1114,990,96,IVORY))
for sz,x in [(32,1260),(24,1310),(16,1355)]:p.append(emb(small,x,1014,sz,BLUE))
p.append('<text x="1098" y="1122" font-size="16" fill="#687068">App icon + small-size cut</text>')
p.append('<text x="64" y="1204" font-size="22">A complete working kit, with room to refine.</text><text x="64" y="1240" font-size="18" fill="#687068">Outlined SVGs / transparent PNGs / web icons / layouts / usage guide</text><text x="64" y="1280" font-size="15" fill="#687068">Selected palette: coastal blue and warm ivory. Brand and trademark availability remain unchecked.</text></g></svg>')
(KIT/'overview.svg').write_text(''.join(p))

def luminance(h):
    cs=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    cs=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in cs]
    return sum(a*b for a,b in zip(cs,[.2126,.7152,.0722]))
contrast=(luminance(IVORY)+.05)/(luminance(BLUE)+.05)
guide=f'''# Nadorly — working logo kit v2
2026-10-19 · Selected direction: B2, Softer arrival. Selected palette: B, Coastal blue with warm ivory. This is a working identity, open to refinement.

## Idea
A front-facing car and a pointed welcoming entrance share one silhouette: mobility for people returning to Nador, through local rental agencies. The entrance is an architectural suggestion, not a traced local monument.

## Files and use
- `svg/nadorly-horizontal-blue.svg`: website header and partner materials.
- `svg/nadorly-stacked-blue.svg`: portrait compositions.
- `svg/nadorly-symbol-blue.svg`: standalone mark, at least 32px square.
- `svg/nadorly-symbol-small.svg`: optical cut for 16–24px; headlights are opened up.
- `svg/nadorly-wordmark-blue.svg`: name only where the symbol already appears nearby.
- `svg/*-white.svg` and `*-ivory.svg`: optically adjusted reversed symbols on dark backgrounds.
- `png/`: transparent raster exports. Keep SVG as the source of truth.
- `web/`: favicon, Apple touch icon, PWA icons, manifest and HTML integration snippet. Paths assume these files are served at the website root; adjust if hosted elsewhere. Maskable icon uses a conservative safe zone.
- `presentation/`: illustrative applications, not evidence of real agency partnerships.

## Clear space and sizes
Keep clear space equal to one arch leg width (28 units on the 256-unit symbol canvas) outside the visible artwork. Existing canvas padding is not a substitute for that external clearance.
Horizontal: recommended minimum 150px wide. Stacked: 140px wide. Name only: 100px wide. Symbol: 32px; use the small optical cut at 16–24px. Preliminary print minimums: horizontal 35mm, symbol 8mm; proof on the actual substrate before manufacturing. At 16px the silhouette leads; do not expect every car detail to read independently.

## Palette
| Colour | HEX | RGB | Role |
|---|---|---|---|
| Coastal blue | #155F8A | 21, 95, 138 | Primary mark and icon background |
| Warm ivory | #F7F2E8 | 247, 242, 232 | Warm light field / reversed mark |
| Deep navy | #142D3B | 20, 45, 59 | Neutral dark use |
| White | #FFFFFF | 255, 255, 255 | Clear backgrounds / reversed mark |

Ivory/blue contrast: {contrast:.2f}:1 (computed sRGB relative luminance). This describes the colour pair, not an accessibility audit of a website. CMYK/spot conversions are intentionally not specified without a printer profile; these are RGB digital masters.

## Lettering
The logo uses the existing custom path-built Nadorly lettering from the concept exploration, with fixed spacing. Logo SVGs have no live font dependency. Do not type the name in another font to recreate the logo. A complete interface type system, especially Arabic typography, remains to be designed separately.

## Placement
Use blue or ink on ivory/white. Use the supplied white/ivory versions on blue/ink. On photography, use a quiet area or solid field. Keep proportions and the fixed layouts; avoid rotation, shadows, outlines and replacing negative counters with white shapes. The counters are transparent geometry.

## Status and limits
The user selected B2 as the direction. The user selected palette B: coastal blue, warm ivory and deep navy. The overall identity remains open to refinement. All prior concepts are preserved. Category research found many car/pin marks; no professional trademark clearance or name availability search has been performed. No exclusivity is claimed. No Arabic brand spelling has been invented. This folder contains digital SVG/PNG/ICO assets, not certified CMYK print artwork or an AI/EPS source.
'''
(KIT/'USAGE.md').write_text(guide,encoding='utf-8')
spec={'brand':'Nadorly','brief':'A car-rental marketplace connecting local agencies in Nador with visitors returning from abroad. Illustrative applications only; no live partner claims.','adjectives':['welcoming','dependable','local','clear'],'criteria':'The chosen B2 arrival gate, in a practical working identity.','industry':'services','mockups':['website','app-icon','signage','business-card','social','favicon-tab'],'nav':['Find a car','How it works','Help'],'brand_color':BLUE,'greyscale':False,'round':5,'concepts':[{'name':'The arrival gate — B2','symbol':'../svg/nadorly-symbol-blue.svg','lockup':'../svg/nadorly-horizontal-blue.svg','idea':'A car and a welcoming entrance share one clear silhouette.','rationale':['An arrival in Nador, not just a vehicle.','Works as one colour and as a compact icon.','Outlined lettering and a dedicated small-size cut.']}],'recommendation':'Selected B2 logo and coastal-blue palette, working version 2.','next_steps':['Review the selected colours in real-world applications','Refine any details before release']}
(KIT/'presentation/spec.json').write_text(json.dumps(spec,indent=2),encoding='utf-8')

if '--render' in sys.argv:
    sys.path.insert(0,str(SKILL))
    import render_png
    for kind in ['horizontal','stacked','symbol','wordmark']:
        for color in ['blue','white','black']:
            src=KIT/'svg'/f'nadorly-{kind}-{color}.svg'
            box=re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"',src.read_text())
            w,h=map(float,box.groups()); size=1200 if kind in ['horizontal','wordmark'] else 1024
            assert render_png.render(str(src),str(KIT/'png'/f'{src.stem}.png'),size,round(size*h/w))
    assert render_png.render(str(KIT/'overview.svg'),str(KIT/'overview.png'),1440,1320)
    subprocess.run([sys.executable,str(SKILL/'export_variants.py'),str(KIT/'svg/nadorly-symbol-blue.svg'),'--only','favicon','app-icon','--favicon-source',str(KIT/'svg/nadorly-symbol-small.svg'),'--web-icons','--icon-bg',BLUE,'--icon-fg',IVORY,'--title','Nadorly','--out-dir',str(KIT/'web')],check=True)
    subprocess.run([sys.executable,str(SKILL/'presentation_board.py'),str(KIT/'presentation/spec.json'),'-o',str(KIT/'presentation/board.html'),'--png-dir',str(KIT/'presentation/slides')],check=True)
    with zipfile.ZipFile(BASE/'nadorly-kit-v2.zip','w',zipfile.ZIP_DEFLATED) as z:
        for f in sorted(KIT.rglob('*')):
            if f.is_file():z.write(f,Path(KIT.name)/f.relative_to(KIT))
    print('Working kit built:',KIT,flush=True)
