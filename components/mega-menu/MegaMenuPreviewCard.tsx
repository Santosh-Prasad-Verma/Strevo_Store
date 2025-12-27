'use client'

import Link from 'next/link';
import Image from 'next/image';

interface MegaMenuPreviewCardProps {
  title: string;
  image: string;
  href: string;
}

export function MegaMenuPreviewCard({ title, image, href }: MegaMenuPreviewCardProps) {
  return (
    <Link
      href={href}
      className="group block relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="200px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <p className="text-white text-sm font-medium">{title}</p>
      </div>
    </Link>
  );
}
