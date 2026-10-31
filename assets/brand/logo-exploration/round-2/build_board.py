from pathlib import Path
import re
import html

ROOT=Path(__file__).resolve().parent

def embed(file,x,y,w,h,white=False):
    raw=(ROOT/file).read_text(encoding='utf-8')
    if white:
        raw=raw.replace('#111111','#ffffff')
    raw=re.sub(r'<title.*?</title>','',raw)
    raw=re.sub(r'\s(role|aria-labelledby)="[^"]*"','',raw)
    return raw.replace('<svg ',f'<svg x="{x}" y="{y}" width="{w}" height="{h}" ',1)

def build(version):
    items=[
      ('A','Open gateway','A clear entrance, with nothing inside.',f'a-v{version}-lockup.svg','Symbol + name','My recommendation: welcoming and locally grounded.'),
      ('B','A welcome in the name','The first n is the doorway.',f'b-v{version}-wordmark.svg','Custom lowercase wordmark','A returning y adds a small gesture of welcome.'),
      ('C','A warmer signature','A quieter, more personal direction.','c-v1-wordmark.svg','Serif wordmark','The name carries the identity; no separate symbol.'),
    ]
    p=['<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1280" viewBox="0 0 1440 1280">',
       '<rect width="1440" height="1280" fill="#f7f6f2"/>',
       '<g font-family="Segoe UI,Arial,sans-serif" fill="#191919">',
       '<text x="64" y="67" font-size="34" font-weight="650">Nadorly — a clearer welcome</text>',
       '<text x="64" y="105" font-size="18" fill="#696966">Round 02  /  Three directions, rebuilt from your feedback</text>']
    for i,(letter,title,note,file,kind,detail) in enumerate(items):
        top=145+i*358
        p.append(f'<rect x="48" y="{top}" width="1344" height="332" rx="20" fill="#fff"/>')
        p.append(f'<text x="86" y="{top+47}" font-size="16" font-weight="700" fill="#777">{letter} / {html.escape(kind.upper())}</text>')
        p.append(embed(file,80,top+56,800,210))
        p.append(f'<text x="947" y="{top+97}" font-size="28" font-weight="650">{html.escape(title)}</text>')
        p.append(f'<text x="947" y="{top+134}" font-size="18" fill="#595959">{html.escape(note)}</text>')
        # Wrap description at a natural short line length.
        words=detail.split(); lines=[]; line=''
        for word in words:
            if len(line)+len(word)>39:
                lines.append(line); line=''
            line+=(' ' if line else '')+word
        lines.append(line)
        for n,line in enumerate(lines):
            p.append(f'<text x="947" y="{top+179+n*25}" font-size="17" fill="#777">{html.escape(line)}</text>')
        p.append(f'<rect x="86" y="{top+264}" width="282" height="48" rx="8" fill="#171717"/>')
        p.append(embed(file,98,top+266,258,43,True))
        p.append(embed(file,424,top+264,200,48))
        p.append(f'<text x="649" y="{top+294}" font-size="13" fill="#888">Small / reversed checks</text>')
    p.append('<text x="64" y="1245" font-size="16" fill="#777">Concept artwork — colour and final identity assets follow the chosen direction.</text></g></svg>')
    (ROOT/f'nadorly-round2-v{version}.svg').write_text(''.join(p),encoding='utf-8')

if __name__=='__main__':
    import sys
    build(int(sys.argv[1]) if len(sys.argv)>1 else 1)
