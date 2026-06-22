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
          backgroundImage: `url(${BASE_URL}/logo.png)`,
          backgroundSize: '1100px 1100px',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    ),
    { ...size },
  );
}
