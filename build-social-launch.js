/**
 * PIXEL — Social Launch Image Builder
 * Time & Culture module — social-launch.png
 * Canvas: 1080x1080px
 */

const sharp = require('./node_modules/sharp');
const path = require('path');

const OUT_PATH = './public/images/time-and-culture/social-launch.png';
const BG_PATH  = './public/images/time-and-culture/social-launch-bg.jpg';
const ICON_PATH = './public/logo-icon.png';

const W = 1080;
const H = 1080;

// Brand colors
const NAVY_OVERLAY = { r: 27, g: 58, b: 107, alpha: 0.65 }; // #1B3A6B @ 65%
const ORANGE = '#E07540';
const OFF_WHITE = '#F8F7F4';

async function build() {
  // ── 1. Resize logo icon to 160px wide (square → 160×160)
  const logoResized = await sharp(ICON_PATH)
    .resize(160, 160, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // ── 2. Build the SVG overlay (all text + graphic elements)
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&amp;display=swap');
      </style>
    </defs>

    <!-- Navy scrim -->
    <rect x="0" y="0" width="${W}" height="${H}"
          fill="rgba(27,58,107,0.65)" />

    <!-- Orange accent bar — top full width, 8px -->
    <rect x="0" y="0" width="${W}" height="8" fill="${ORANGE}" />

    <!-- Label: ASSESSMENT MODULE — top left, below bar -->
    <text
      x="72" y="68"
      font-family="'Arial', 'Helvetica Neue', sans-serif"
      font-size="17"
      font-weight="700"
      fill="${ORANGE}"
      letter-spacing="4"
      text-anchor="start"
      dominant-baseline="middle"
      style="text-transform: uppercase;"
    >ASSESSMENT MODULE</text>

    <!-- Large serif title — Line 1 -->
    <text
      x="72" y="275"
      font-family="'Georgia', 'Times New Roman', serif"
      font-size="118"
      font-weight="700"
      fill="${OFF_WHITE}"
      letter-spacing="-1"
      text-anchor="start"
      dominant-baseline="auto"
    >Your Time Is</text>

    <!-- Large serif title — Line 2 -->
    <text
      x="72" y="415"
      font-family="'Georgia', 'Times New Roman', serif"
      font-size="118"
      font-weight="700"
      fill="${OFF_WHITE}"
      letter-spacing="-1"
      text-anchor="start"
      dominant-baseline="auto"
    >Not My Time</text>

    <!-- Orange divider line under title -->
    <rect x="72" y="448" width="80" height="3" fill="${ORANGE}" />

    <!-- Subtitle — slightly larger, word-wrapped via tspan -->
    <text
      x="72" y="510"
      font-family="'Arial', 'Helvetica Neue', sans-serif"
      font-size="23"
      fill="${OFF_WHITE}"
      letter-spacing="0.3"
      text-anchor="start"
      dominant-baseline="auto"
      opacity="0.92"
    >
      <tspan x="72" dy="0">Discover your time orientation.</tspan>
      <tspan x="72" dy="36">Understand the culture you work with.</tspan>
      <tspan x="72" dy="36">Lead across the gap.</tspan>
    </text>

  </svg>`;

  // ── 3. Composite everything
  const result = await sharp(BG_PATH)
    .resize(W, H, { fit: 'cover', position: 'center' })
    .composite([
      // SVG overlay (scrim + all text + graphic elements)
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
      // Crispy Leaders logo icon — bottom right, 40px margin
      {
        input: logoResized,
        top: H - 160 - 40,   // 880px from top
        left: W - 160 - 40,  // 880px from left
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(OUT_PATH);

  console.log('✓ Output written:', OUT_PATH);
  console.log('  Size:', result.width, 'x', result.height, '—', result.size, 'bytes');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
