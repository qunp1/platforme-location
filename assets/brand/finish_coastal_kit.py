from pathlib import Path
import zipfile, json, xml.etree.ElementTree as ET
from PIL import Image
R=Path(__file__).resolve().parent
K=R/'nadorly-kit-v2'
for p in (K/'svg').glob('*.svg'):
    root=ET.parse(p).getroot()
    for el in root.iter():
        assert el.tag.split('}')[-1] not in ['text','image','filter','mask'],p
for p in (K/'png').glob('*.png'):
    im=Image.open(p)
    assert im.width>0 and im.height>0
    assert im.mode=='RGBA' and im.getchannel('A').getextrema()==(0,255),(p,im.mode)
for size in [16,32,48]:
    assert Image.open(K/'web'/f'favicon-{size}.png').size==(size,size)
manifest=json.loads((K/'web/site.webmanifest').read_text())
for entry in manifest['icons']:assert (K/'web'/entry['src'].lstrip('/')).exists()
for p in (K/'presentation/slides').glob('*.png'):Image.open(p).verify()
with zipfile.ZipFile(R/'nadorly-kit-v2.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(K.rglob('*')):
        if p.is_file():z.write(p,Path(K.name)/p.relative_to(K))
with zipfile.ZipFile(R/'nadorly-kit-v2.zip') as z:
    assert z.testzip() is None
    print(f'Validated {len(list((K/"svg").glob("*.svg")))} SVGs, {len(list((K/"png").glob("*.png")))} transparent PNGs; ZIP contains {len(z.namelist())} files.')
