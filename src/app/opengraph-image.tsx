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
          position: 'relative',
        }}
      >
        {/* Logo */}
        <img
          src={logoSrc}
          width={200}
          height={200}
          style={{ objectFit: 'contain', marginBottom: '48px' }}
        />

        {/* Tagline */}
        <div
          style={{
            color: '#3A9E9E',
            fontSize: 34,
            fontWeight: 600,
            textAlign: 'center',
            lineHeight: 1.3,
            display: 'flex',
          }}
        >
          Mapping the Myrtle Beach Startup Ecosystem
        </div>

        {/* CTA */}
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '72px',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 24,
            fontWeight: 500,
            display: 'flex',
          }}
        >
          Explore the Directory →
        </div>
      </div>
    ),
    { ...size },
  );
}
