// 빌드해서 저장소 루트의 wheel/ 폴더(GitHub Pages 주소 .../wheel/)에 내놓는다.
// 해시가 붙은 옛 번들이 쌓이지 않도록 wheel/ 를 먼저 비운다.
//
// - wheel/index.html: 캐릭터 버전 (구슬마다 두근두근 캐릭터)
// - wheel/text.html : 글자 버전. index.html 과 같은 번들을 쓰고 <html data-skin> 과 제목만 다르다
const { execFileSync } = require('node:child_process');
const { readFileSync, rmSync, mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const out = path.resolve(root, '../../wheel');

rmSync(out, { recursive: true, force: true });
rmSync(path.join(root, '.parcel-cache'), { recursive: true, force: true });
mkdirSync(out, { recursive: true });

execFileSync(
  path.join(root, 'node_modules/.bin/parcel'),
  ['build', 'index.html', '--public-url', './', '--dist-dir', out, '--no-source-maps'],
  { cwd: root, stdio: 'inherit' }
);

const indexHtml = readFileSync(path.join(out, 'index.html'), 'utf8');
const skinAttr = /data-skin=("mong"|'mong'|mong)(?=[\s>])/;
const titleTag = /<title>[^<]*<\/title>/;
if (!skinAttr.test(indexHtml) || !titleTag.test(indexHtml)) {
  throw new Error('index.html 에서 data-skin 이나 <title> 을 찾지 못해 글자 버전을 만들 수 없습니다');
}
writeFileSync(
  path.join(out, 'text.html'),
  indexHtml.replace(skinAttr, 'data-skin="text"').replace(titleTag, '<title>두근두근 룰렛 (글자)</title>')
);

// 빌드 결과만 보는 사람을 위한 안내. 라이선스 원문(LICENSE.txt)은 Parcel 이 index.html 의 링크를 따라 함께 내놓는다
writeFileSync(
  path.join(out, 'README.md'),
  [
    '# 두근두근 룰렛 (빌드 결과)',
    '',
    '- `index.html`: 캐릭터 버전 (구슬마다 두근두근 캐릭터)',
    '- `text.html`: 글자 버전 (색 구슬과 이름·번호만)',
    '',
    '이 폴더는 `tools/wheel` 을 빌드해 만든 결과입니다. 직접 고치지 말고 `tools/wheel` 에서 고친 뒤 `npm run build` 하세요.',
    '',
    '원본: https://github.com/lazygyu/roulette (MIT License, Copyright (c) 2022 LazyGyu). 라이선스 원문은 이 폴더의 `LICENSE.txt` 에 있습니다. 아이콘은 Font Awesome Free (CC BY 4.0, https://fontawesome.com/license/free) 입니다.',
    '',
  ].join('\n')
);
console.log(`built → ${path.relative(process.cwd(), out) || out}`);
