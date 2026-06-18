import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const alt = 'Startup MB — Mapping the Myrtle Beach Startup Ecosystem';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logoBuffer = await readFile(path.join(process.cwd(), 'public/logo-white.png'));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#1B3A52',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Logo */}
        <img
          src={logoSrc}
          width={160}
          height={160}
          style={{ objectFit: 'contain', marginBottom: '36px' }}
        />

        {/* Site name */}
        <div
          style={{
            color: 'white',
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: '-2px',
            lineHeight: 1,
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          Startup MB
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#3A9E9E',
            fontSize: 30,
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.3,
            display: 'flex',
          }}
        >
          Mapping the Myrtle Beach Startup Ecosystem
        </div>

        {/* URL */}
        <div
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: 22,
            marginTop: '52px',
            display: 'flex',
          }}
        >
          startupmb.com
        </div>
      </div>
    ),
    { ...size },
  );
}
