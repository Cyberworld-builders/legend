import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') || 'CyberWorld Builders';
  const description = searchParams.get('description') || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#000000',
          padding: '60px',
          fontFamily: 'monospace',
        }}
      >
        {/* Decorative top border */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #00ff00 0%, #00cc00 50%, #009900 100%)',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Terminal prompt */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#00ff00',
              fontSize: '20px',
              opacity: 0.6,
            }}
          >
            {'>'} cyberworldbuilders.com/blog
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 60 ? '40px' : '48px',
              fontWeight: 700,
              color: '#00ff00',
              lineHeight: 1.2,
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                color: '#00ff00',
                opacity: 0.7,
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {description.length > 140 ? description.slice(0, 140) + '...' : description}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#00ff00',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            CyberWorld Builders
          </div>
          <div
            style={{
              display: 'flex',
              color: '#00ff00',
              opacity: 0.5,
              fontSize: '18px',
            }}
          >
            Jay Long — Software Engineer & Founder
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
