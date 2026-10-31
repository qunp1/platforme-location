"""Second round: clear entrances and warmer, name-led original vector sketches."""
from pathlib import Path
from build_concepts import LETTERS

OUT = Path(__file__).resolve().parent / 'round-2'
OUT.mkdir(exist_ok=True)

GATE = 'M44 220V122C44 80 84 60 128 28C172 60 212 80 212 122V220H178V124C178 98 154 82 128 64C102 82 78 98 78 124V220Z'
LOWER_N = 'M0 96V48C0 18 17 0 44 0C71 0 88 18 88 48V96H68V48C68 29 59 19 44 19C29 19 20 29 20 48V96Z'

def word(kind, version):
    result, x = [], 0
    for index, (width, original) in enumerate(LETTERS):
        path = original
        if index == 0:
            if kind == 'b':
                path, width = LOWER_N, 88
                if version >= 2:
                    path = 'M0 96V24H16V33C22 26 30 22 40 22C62 22 74 36 74 60V96H58V60C58 44 50 36 38 36C24 36 16 46 16 60V96Z'
                    width = 74
            else:
                path = original.replace('L57 66', 'L57 69.28').replace('L17 30', 'L17 26.72')
        if kind == 'b' and index == 6:
            # The return gesture belongs to a recognisable letter, not an extra icon.
            path = 'M0 24H18L36 76L53 24H70L42 102C35 124 19 136 -10 136H-36V120H-10C10 120 21 113 27 96Z'
        if version >= 2 and kind == 'b' and index == 5:
            # Open the l/y pair slightly after the first render.
            width += 4
        result.append(f'<path transform="translate({x} 0)" fill-rule="evenodd" d="{path}"/>')
        x += width + (10 if kind == 'b' else 13)
    return ''.join(result), x

def svg(body, width, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 256" role="img" aria-labelledby="title"><title id="title">{title}</title><g fill="#111111">{body}</g></svg>\n'

def build(version):
    gate = GATE
    if version >= 2:
        # Shallower crown: more of an entrance, less of a pointed emblem.
        gate = gate.replace('128 28', '128 36').replace('128 64', '128 72')
    (OUT / f'a-v{version}-symbol.svg').write_text(svg(f'<path d="{gate}"/>',256,'Nadorly — open gateway'),encoding='utf-8')
    letters, width = word('a', version)
    (OUT / f'a-v{version}-lockup.svg').write_text(svg(f'<g transform="translate(0 26) scale(.78)"><path d="{gate}"/></g><g transform="translate(244 66) scale(1.05)">{letters}</g>',800,'Nadorly — open gateway lockup'),encoding='utf-8')
    letters, width = word('b', version)
    (OUT / f'b-v{version}-wordmark.svg').write_text(svg(f'<g transform="translate(32 36) scale(1.35)">{letters}</g>',710 if version >= 2 else 800,'Nadorly — welcome wordmark'),encoding='utf-8')
    (OUT / f'b-v{version}-detail.svg').write_text(svg(f'<g transform="translate(40 32) scale(2)"><path d="{LOWER_N}"/></g>',256,'Nadorly — lowercase doorway detail'),encoding='utf-8')

if __name__ == '__main__':
    import sys
    build(int(sys.argv[1]) if len(sys.argv)>1 else 1)
