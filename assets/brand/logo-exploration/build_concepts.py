"""Original Nadorly vector sketches; custom outlined letters, no font dependency."""
from pathlib import Path
import html

OUT = Path(__file__).resolve().parent
MARKS = {
    'a': '<path d="M40 208V66Q40 48 58 48H78L176 150V48H216V190Q216 208 198 208H178L80 106V208Z"/>',
    'b': '<path d="M48 208V116C48 68 80 36 128 36S208 68 208 116V208H170V116C170 88 154 72 128 72S86 88 86 116V208Z"/><path d="M108 224V160Q108 140 128 140H164V174H142V224Z"/>',
    'c': '<path d="M40 144V76Q40 40 76 40H144V80H84Q80 80 80 84V144Z"/><path d="M112 216V176H172Q176 176 176 172V112H216V180Q216 216 180 216Z"/><path d="M72 156L156 72L184 100L100 184Z"/>',
}

# Capitals to x-height ratio and spacing are drawn for this name, not a font file.
LETTERS = [
    (74, 'M0 96V0H17L57 66V0H74V96H57L17 30V96Z'),
    (62, 'M60 24V96H44V89C38 95 31 98 23 98C4 98 -6 83 -6 60C-6 37 6 22 24 22C33 22 40 25 46 32V24Z M44 60C44 45 37 36 26 36C15 36 9 45 9 60C9 75 15 84 26 84C37 84 44 75 44 60Z'),
    (63, 'M60 0V96H44V89C38 95 31 98 23 98C4 98 -6 83 -6 60C-6 37 6 22 24 22C33 22 39 25 44 31V0Z M44 60C44 45 37 36 26 36C15 36 9 45 9 60C9 75 15 84 26 84C37 84 44 75 44 60Z'),
    (67, 'M31 22C52 22 65 37 65 60C65 83 52 98 31 98C10 98 -3 83 -3 60C-3 37 10 22 31 22Z M31 36C19 36 13 45 13 60C13 75 19 84 31 84C43 84 49 75 49 60C49 45 43 36 31 36Z'),
    (44, 'M0 96V24H15V36C21 26 29 22 41 23V40C26 37 16 46 16 62V96Z'),
    (29, 'M0 0H16V73Q16 83 26 83V98Q0 100 0 75Z'),
    (65, 'M0 24H18L36 76L53 24H70L42 102Q34 124 10 122V107Q23 109 27 96Z'),
]

def wordmark(version=1):
    pieces, x = [], 0
    for width, path in LETTERS:
        if version >= 3 and x == 0:
            path = path.replace('L57 66', 'L57 69.28').replace('L17 30', 'L17 26.72')
        pieces.append(f'<path transform="translate({x} 0)" fill-rule="evenodd" d="{path}"/>')
        x += width + 13
    return ''.join(pieces)

def svg(body, width, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 256" role="img" aria-labelledby="title"><title id="title">{html.escape(title)}</title><g fill="#111111">{body}</g></svg>\n'

def build(version):
    for key, body in MARKS.items():
        if version >= 2 and key == 'a':
            body = body.replace('H78L176 150', 'H80L176 144').replace('H178L80 106', 'H176L80 112')
        # Second pass: reduce portal's inner path so its clearances survive 16 px.
        if version >= 2 and key == 'b':
            body = body.replace('M108 224V160Q108 140 128 140H164V174H142V224Z', 'M110 224V160Q110 142 128 142H154V174H142V224Z')
        if version >= 2 and key == 'c':
            body = '<path d="M40 136V76Q40 40 76 40H136V80H84Q80 80 80 84V136Z"/><path d="M120 216V176H172Q176 176 176 172V120H216V180Q216 216 180 216Z"/><path d="M80 160L160 80L184 104L104 184Z"/>'
        (OUT / f'concept-{key}-v{version}-symbol.svg').write_text(svg(body, 256, f'Nadorly concept {key.upper()} symbol'), encoding='utf-8')
        lockup = f'<g transform="translate(8 26) scale(.78)">{body}</g><g transform="translate(258 66) scale(1.05)">{wordmark(version)}</g>'
        (OUT / f'concept-{key}-v{version}-lockup.svg').write_text(svg(lockup, 810 if version >= 3 else 900, f'Nadorly concept {key.upper()} lockup'), encoding='utf-8')

if __name__ == '__main__':
    import sys
    build(int(sys.argv[1]) if len(sys.argv) > 1 else 1)
