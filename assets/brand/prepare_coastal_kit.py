from pathlib import Path

R=Path(__file__).resolve().parent
source=(R/'build_kit.py').read_text(encoding='utf-8')
replacements=[
    ('nadorly-kit-v1','nadorly-kit-v2'),
    ('#315F53','#155F8A'),('#F9F4E7','#F7F2E8'),('#17201B','#142D3B'),
    ('49, 95, 83','21, 95, 138'),('249, 244, 231','247, 242, 232'),('23, 32, 27','20, 45, 59'),
    ('GREEN','BLUE'),('CREAM','IVORY'),('green','blue'),('Green','Blue'),
    ('cream','ivory'),('Cream','Ivory'),('Nador blue','Coastal blue'),('Warm ivory','Warm ivory'),
    ('Deep ink','Deep navy'),('VERSION 01','VERSION 02'),('kit v1','kit v2'),
    ('Selected direction: B2, Softer arrival.','Selected direction: B2, Softer arrival. Selected palette: B, Coastal blue with warm ivory.'),
    ('Colour is proposed for this version.','Selected palette: coastal blue and warm ivory.'),
    ('Colour is a proposal in this version, not an independently approved final palette.','The user selected palette B: coastal blue, warm ivory and deep navy. The overall identity remains open to refinement.'),
    ('Selected direction, working version 1.','Selected B2 logo and coastal-blue palette, working version 2.'),
    ('Review colour and real-world applications','Review the selected colours in real-world applications'),
    ("str(KIT/'presentation/board.html')],check=True)","str(KIT/'presentation/board.html'),'--png-dir',str(KIT/'presentation/slides')],check=True)"),
]
for a,b in replacements:source=source.replace(a,b)
(R/'build_coastal_kit.py').write_text(source,encoding='utf-8')
finish=(R/'finish_kit.py').read_text(encoding='utf-8').replace('nadorly-kit-v1','nadorly-kit-v2')
(R/'finish_coastal_kit.py').write_text(finish,encoding='utf-8')
print('Prepared coastal-blue kit builder; the green version is preserved.')
