from pathlib import Path
import re

R=Path(__file__).resolve().parent
R.mkdir(exist_ok=True)
# Filled geometry; transparent counters, no masks or embedded imagery.
A='''<path fill-rule="evenodd" d="M24 152V112C24 54 70 16 128 16S232 54 232 112V132H204V112C204 69 171 44 128 44S52 69 52 112V132L68 104Q73 96 84 96H143Q155 96 164 107L185 132L209 138.43Q232 143 232 165V188H211A27 27 0 0 1 157 188H99A27 27 0 0 1 45 188H24ZM77 132H151L137 116H88ZM72 176A12 12 0 1 0 72 200A12 12 0 1 0 72 176ZM184 176A12 12 0 1 0 184 200A12 12 0 1 0 184 176Z"/>'''
B='''<path fill-rule="evenodd" d="M32 208V113C32 64 75 43 128 16C181 43 224 64 224 113V208H196V188H60V208ZM60 138H196L182 107Q178 98 168 98H88Q78 98 74 107ZM79 155A10 10 0 1 0 79 175A10 10 0 1 0 79 155ZM177 155A10 10 0 1 0 177 175A10 10 0 1 0 177 155ZM88 72L128 48L168 72Z"/>'''
C='''<path fill-rule="evenodd" d="M128 16C71 16 32 56 32 109C32 153 64 190 116 237Q128 248 140 237C192 190 224 153 224 109C224 56 185 16 128 16ZM77 157V70H102L151 119V70H179V157H154L105 108V157Z"/>'''
def svg(body,box='0 0 256 256',color='#151515'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" role="img"><title>Nadorly concept</title><g fill="{color}">{body}</g></svg>'
old=(R.parent/'round-2/a-v2-lockup.svg').read_text()
word=old[old.index('<g transform="translate(244'):].split('</g></g></svg>')[0]
word=re.sub(r'<g transform="translate\(244 66\) scale\(1.05\)">','<g transform="translate(0 0)">',word)+'</g>'
symbols=[A,B,C]
for i,body in enumerate(symbols):
    letter='abc'[i]
    (R/f'{letter}-v1-symbol.svg').write_text(svg(body))
    (R/f'{letter}-v1-lockup.svg').write_text(svg(f'<g transform="translate(0 0) scale(.9)">{body}</g><g transform="translate(258 71) scale(1.05)">{word}</g>','0 0 800 256'))
def embed(body,x,y,size,color='#151515'):
    return f'<g transform="translate({x} {y}) scale({size/256})" fill="{color}">{body}</g>'
def board(version):
    p=['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1120" viewBox="0 0 1600 1120"><rect width="1600" height="1120" fill="#f4f1e9"/>', '<g font-family="Segoe UI, Arial, sans-serif" fill="#171c19">', '<text x="64" y="72" font-size="18" letter-spacing="3">NADORLY / LOGO EXPLORATION 03</text>', '<text x="64" y="137" font-size="44" font-weight="600">A familiar place. A car waiting.</text>', '<text x="64" y="179" font-size="21" fill="#666b65">Three ways to connect mobility, Nador and the journey home.</text>']
    names=['The return arch','The arrival gate','Nador, located']
    notes=[['A car meets an open, welcoming arch.','Closest to the clarity of your reference.'],['A vehicle framed by a pointed entrance.','The strongest link to arrival and welcome.'],['The N of Nador cut into a destination.','The simplest, most compact alternative.']]
    for i,b in enumerate(symbols):
        x=48+i*506
        p.append(f'<rect x="{x}" y="224" width="492" height="682" rx="4" fill="#fff"/>')
        p.append(f'<text x="{x+30}" y="272" font-size="17" fill="#7b8079">{"ABC"[i]} / {names[i].upper()}</text>')
        p.append(embed(b,x+90,305,310))
        p.append(f'<g transform="translate({x+92} 653) scale(.63)" fill="#171c19">{word}</g>')
        for j,n in enumerate(notes[i]):p.append(f'<text x="{x+30}" y="{745+j*28}" font-size="18" fill="#626961">{n}</text>')
        p.append(f'<rect x="{x+30}" y="825" width="64" height="55" rx="5" fill="#171c19"/>')
        p.append(embed(b,x+40,831,44,'#ffffff'))
        for size,xx in [(32,x+126),(24,x+200),(16,x+266)]:
            p.append(embed(b,xx,843,size))
            p.append(f'<text x="{xx}" y="894" font-size="11" fill="#8b8e88">{size}px</text>')
    p.append('<rect x="48" y="940" width="1504" height="124" fill="#315f53"/>')
    p.append(embed(symbols[1],79,955,94,'#faf4e7'))
    p.append(f'<g transform="translate(197 979) scale(.43)" fill="#faf4e7">{word}</g>')
    p.append('<text x="650" y="987" font-size="22" fill="#faf4e7">B / My recommendation</text><text x="650" y="1025" font-size="19" fill="#d5e0d8">A welcoming entrance, with the car built into the same silhouette.</text>')
    p.append('</g></svg>')
    (R/f'nadorly-round3-v{version}.svg').write_text(''.join(p))
board(1)

