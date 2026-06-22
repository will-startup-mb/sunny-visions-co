import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BASE_URL = 'https://sunny-visions-co.vercel.app';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          backgroundColor: '#F5EFE0',
          overflow: 'hidden',
        }}
      >
        {/* Scale logo to 1200×1200, shift up 285px to show vertical center
            Logo text lives at ~y:800–1200 in the 2000×2000 canvas.
            At 0.6x scale → y:480–720. OG height=630, so marginTop=-(600-315)=-285. */}
        <img
          src={`${BASE_URL}/logo.png`}
          style={{
            width: '1200px',
            height: '1200px',
            marginTop: '-285px',
            flexShrink: 0,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
