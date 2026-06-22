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
          flexDirection: 'column',
        }}
      >
        {/* Logo — bg-image crops into the center strip of the 2000×2000 canvas */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            backgroundColor: '#F5EFE0',
            backgroundImage: `url(${BASE_URL}/logo.png)`,
            backgroundSize: '1100px 1100px',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Branded tagline strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E8521A',
            padding: '22px 48px',
          }}
        >
          <span
            style={{
              color: '#F2BC2B',
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
            }}
          >
            One Stop Shop for Content, Design &amp; Branding
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
