'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useMegaMenu } from '@/lib/hooks/useMegaMenu';
import { MegaMenuColumn } from './MegaMenuColumn';
import { MegaMenuPreviewCard } from './MegaMenuPreviewCard';
import { Menu, X } from 'lucide-react';

const menuData = {
  women: {
    categories: [
      { name: 'Clothing', items: ['T-Shirts', 'Hoodies', 'Jeans', 'Dresses', 'Jackets'] },
      // { name: 'Accessories', items: ['Bags', 'Jewelry', 'Hats', 'Scarves'] },
      // { name: 'Footwear', items: ['Sneakers', 'Boots', 'Sandals'] },
    ],
    featured: [
      { title: 'New Spring Collection', image: '/featured-1.jpg', href: '/products?category=Women&new=true' },
      { title: 'Sale Up to 50%', image: '/featured-2.jpg', href: '/products?category=Women&sale=true' },
    ],
  },
  men: {
    categories: [
      { name: 'Clothing', items: ['T-Shirts', 'Hoodies', 'Jeans', 'Shirts', 'Jackets'] },
      // { name: 'Accessories', items: ['Bags', 'Watches', 'Belts', 'Caps'] },
      // { name: 'Footwear', items: ['Sneakers', 'Boots', 'Loafers'] },
    ],
    featured: [
      { title: 'Streetwear Essentials', image: '/featured-3.jpg', href: '/products?category=Men&collection=streetwear' },
      { title: 'Premium Denim', image: '/featured-4.jpg', href: '/products?category=Men&subcategory=Jeans' },
    ],
  },
};

export function MegaMenu() {
  const { activeMenu, openMenu, closeMenu, isMobileOpen, toggleMobile } = useMegaMenu();

  return (
    <>
      {/* Desktop Menu */}
      <nav className="hidden lg:flex items-center gap-8" role="menubar">
        {Object.entries(menuData).map(([key, data]) => (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => openMenu(key)}
            onMouseLeave={closeMenu}
          >
            <button
              className="text-sm font-medium uppercase tracking-wider hover:text-neutral-600 transition-colors py-2"
              aria-haspopup="true"
              aria-expanded={activeMenu === key}
            >
              {key}
            </button>

            <AnimatePresence>
              {activeMenu === key && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50"
                  role="menu"
                >
                  <div className="bg-white border border-neutral-200 rounded-lg shadow-2xl p-8 w-[800px]">
                    <div className="grid grid-cols-4 gap-8">
                      {data.categories.map((cat, idx) => (
                        <MegaMenuColumn key={idx} title={cat.name} items={cat.items} category={key} />
                      ))}
                      
                      <div className="space-y-4">
                        {data.featured.map((item, idx) => (
                          <MegaMenuPreviewCard key={idx} {...item} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Mobile Toggle */}
      <button
        onClick={toggleMobile}
        className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobile}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold uppercase">Menu</h2>
                  <button onClick={toggleMobile} className="p-2 hover:bg-neutral-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {Object.entries(menuData).map(([key, data]) => (
                  <div key={key} className="mb-6">
                    <h3 className="text-lg font-bold uppercase mb-3">{key}</h3>
                    {data.categories.map((cat, idx) => (
                      <div key={idx} className="mb-4">
                        <p className="font-medium text-sm text-neutral-600 mb-2">{cat.name}</p>
                        <div className="space-y-1">
                          {cat.items.map((item, i) => (
                            <Link
                              key={i}
                              href={`/products?category=${key}&subcategory=${item}`}
                              className="block text-sm py-1 hover:text-neutral-600"
                              onClick={toggleMobile}
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
