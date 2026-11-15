"""두근두근 캐릭터 그림(저장소 루트 assets/mong)을 구슬용 정사각형 PNG로 줄여 assets/mong 에 둔다.

구슬은 정사각형 칸에 그림을 그리므로, 투명 여백을 잘라낸 뒤 정사각형으로 채우고 200px 로 줄인다 (결과 화면에서 100px 크기로 그리므로 고해상도 화면까지 넉넉하다).
캐릭터를 바꾸거나 더하면 CHARACTERS 를 고치고 `python3 scripts/make_mong.py` 를 다시 돌린다.
(src/characters.ts 의 목록도 같은 순서로 맞춘다)
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parents[1] / 'assets' / 'mong'
OUT = ROOT / 'assets' / 'mong'
SIZE = 200
PAD = 0.04  # 가장자리 여백 비율

CHARACTERS = ['dugeun', 'arong', 'chorong', 'doran', 'gori', 'mandu', 'mongsil', 'salang', 'ssiat', 'ttukttak', 'drum']
# 설정 패널 위로 고개를 내미는 '낭만당곡' 머리띠 두근몽 (폭 160px)
PEEK = ('dugeun-band', 'peek', 160)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name in CHARACTERS:
        im = Image.open(SRC / f'{name}.png').convert('RGBA')
        im = im.crop(im.getchannel('A').getbbox())
        side = round(max(im.size) * (1 + PAD * 2))
        square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
        square.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)
        square = square.resize((SIZE, SIZE), Image.LANCZOS)
        square.save(OUT / f'{name}.png', optimize=True)
        print(f'{name}.png', (OUT / f'{name}.png').stat().st_size, 'bytes')

    src, out, width = PEEK
    im = Image.open(SRC / f'{src}.png').convert('RGBA')
    im = im.crop(im.getchannel('A').getbbox())
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(OUT / f'{out}.png', optimize=True)
    print(f'{out}.png', (OUT / f'{out}.png').stat().st_size, 'bytes')


if __name__ == '__main__':
    main()
