import Image from 'next/image';
import Link from 'next/link';
import { PublicNav } from './PublicNav';

export function PublicHeader() {
  return (
    <header
      style={{
        backgroundColor: '#F5EFE0',
        borderBottom: '1px solid #e0d5c4',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Sunny Visions Co."
              height={2000}
              width={2000}
              style={{ height: '3.5rem', width: '16rem', objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
          </Link>
          <PublicNav />
        </div>
      </div>
    </header>
  );
}
