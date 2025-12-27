'use client'

import Link from 'next/link';

interface MegaMenuColumnProps {
  title: string;
  items: string[];
  category: string;
}

export function MegaMenuColumn({ title, items, category }: MegaMenuColumnProps) {
  return (
    <div>
      <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-neutral-900">
        {title}
      </h3>
      <ul className="space-y-2" role="menu">
        {items.map((item, idx) => (
          <li key={idx} role="none">
            <Link
              href={`/products?category=${category}&subcategory=${item}`}
              className="text-sm text-neutral-600 hover:text-black transition-colors block py-1"
              role="menuitem"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
