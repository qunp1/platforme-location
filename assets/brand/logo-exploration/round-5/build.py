from pathlib import Path
import re
R=Path(__file__).resolve().parent
R.mkdir(exist_ok=True)
# Three new developments of the arrival-gate family. Filled, transparent counters.
wide='''<path fill-rule="evenodd" d="M20 211V127C20 83 65 58 118 36Q128 32 138 36C191 58 236 83 236 127V211H204V190H52V211ZM73 90H183Q158 71 128 58Q98 71 73 90ZM51 145H205L189.41 118Q185 110 175 110H81Q71 110 66.59 118ZM59 159Q52 159 52 166Q52 173 59 173H87Q94 173 94 166Q94 159 87 159ZM169 159Q162 159 162 166Q162 173 169 173H197Q204 173 204 166Q204 159 197 159Z"/>'''
horseshoe='''<path d="M25 220V151C12 134 12 113 18 93C29 56 79 29 128 12C177 29 227 56 238 93C244 113 244 134 231 151V220H207V143C220 128 220 114 215 100C206 74 168 52 128 38C88 52 50 74 41 100C36 114 36 128 49 143V220Z"/><path fill-rule="evenodd" d="M67 213Q61 213 61 207V156Q61 149 65 141L80 111Q85 101 97 101H159Q171 101 176 111L191 141Q195 149 195 156V207Q195 213 189 213H177Q171 213 171 207V194H85V207Q85 213 79 213ZM84 143H172L162 123Q160 120 156 120H100Q96 120 94 123ZM88 160A9 9 0 1 0 88 178A9 9 0 1 0 88 160ZM168 160A9 9 0 1 0 168 178A9 9 0 1 0 168 160Z"/>'''
compact='''<path fill-rule="evenodd" d="M36 151V112C36 69 76 43 120 20Q128 16 136 20C180 43 220 69 220 112V151Q232 155 232 169V191Q232 205 218 205H211V220H181V205H75V220H45V205H38Q24 205 24 191V169Q24 155 36 151ZM79 78H177Q156 60 128 46Q100 60 79 78ZM62 145H194L181 113Q178 104 168 104H88Q78 104 75 113ZM58 164V181H89Q96 181 96 174V171Q96 164 89 164ZM167 164Q160 164 160 171V174Q160 181 167 181H198V164Z"/>'''
items=[('01','Lower and wider',wide,'A broader stance and a calmer, lower arch.','More like a car; less like a tall transport icon.'),('02','Horseshoe entrance',horseshoe,'A more architectural curve around a compact car.','A stronger sense of place, with more detail.'),('03','Car first',compact,'The vehicle steps beyond the arch at its shoulders.','A clearer bumper and wheels; a more active silhouette.')]
old=(R.parent/'round-2/a-v2-lockup.svg').read_text()
word=old[old.index('<g transform="translate(244'):].split('</g></g></svg>')[0]
word=re.sub(r'<g transform="translate\(244 66\) scale\(1.05\)">','<g>',word)+'</g>'
def svg(b,box='0 0 256 256'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img"><title>Nadorly logo variation</title><g fill="#171B18">{b}</g></svg>'
def emb(b,x,y,size,col='#171B18'):
    return f'<g transform="translate({x} {y}) scale({size/256})" fill="{col}">{b}</g>'
for code,name,b,*_ in items:
    (R/f'variant-{code}-v1.svg').write_text(svg(b))
    (R/f'variant-{code}-lockup-v1.svg').write_text(svg(f'{emb(b,0,0,230)}<g transform="translate(258 71) scale(1.05)">{word}</g>','0 0 800 256'))
p=['<svg xmlns="http://www.w3.org/2000/svg" width="1560" height="1140" viewBox="0 0 1560 1140"><rect width="1560" height="1140" fill="#f6f3ec"/><g font-family="Segoe UI,Arial,sans-serif" fill="#171B18">','<text x="58" y="60" font-size="17" letter-spacing="3">NADORLY / FURTHER EXPLORATION</text>','<text x="58" y="124" font-size="43" font-weight="600">The same welcome. A different character.</text>','<text x="58" y="168" font-size="20" fill="#687068">Three new variations on the car and entrance — all still open for refinement.</text>']
for i,(code,name,b,d1,d2) in enumerate(items):
    x=40+i*508
    p.append(f'<rect x="{x}" y="212" width="492" height="704" fill="#fff"/>')
    p.append(f'<text x="{x+28}" y="260" font-size="21" font-weight="600">{code} / {name}</text>')
    p.append(emb(b,x+88,302,316))
    p.append(f'<g transform="translate({x+97} 646) scale(.61)" fill="#171B18">{word}</g>')
    p.append(f'<text x="{x+28}" y="750" font-size="17" fill="#566157">{d1}</text>')
    p.append(f'<text x="{x+28}" y="779" font-size="16" fill="#737b73">{d2}</text>')
    p.append(f'<rect x="{x+28}" y="827" width="68" height="62" rx="5" fill="#171B18"/>')
    p.append(emb(b,x+35,832,54,'#fff'))
    for sz,dx in [(48,130),(32,217),(24,288),(16,353)]:
        p.append(emb(b,x+dx,837,sz))
        p.append(f'<text x="{x+dx}" y="901" font-size="11" fill="#8a8f88">{sz}px</text>')
p.append('<rect x="40" y="950" width="1480" height="142" fill="#315f53"/>')
p.append(emb(wide,66,964,112,'#f9f4e7'))
p.append(f'<g transform="translate(202 997) scale(.5)" fill="#f9f4e7">{word}</g>')
p.append('<text x="660" y="1001" font-size="23" fill="#f9f4e7">My recommendation: 01</text><text x="660" y="1039" font-size="19" fill="#d9e3db">It keeps the idea you liked, with more natural car proportions.</text>')
p.append('</g></svg>')
(R/'nadorly-variants-v1.svg').write_text(''.join(p))
(R/'README.md').write_text('''# Further logo exploration\n\nUser requested new variants after the B2 working kit. The kit is preserved; no replacement is approved. Three variations keep the entrance-and-car idea while changing its character.\n\n01: lower, wider body; broad upper counter; pill headlights. Recommended to reduce the bus-like height.\n02: horseshoe entrance and separated compact vehicle; more regional architectural character, but greater detail and weaker tiny-size separation.\n03: protruding bumper and distinct wheels; more explicitly automotive, but potentially more badge-like.\n\nAll custom filled SVG paths. Existing outlined wordmark is held constant. No new trademark search; no clearance claim.\n''')

