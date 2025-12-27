export const MENU_DATA = {
  men: {
    label: "Men",
    categories: [
      { 
        title: "Clothing", 
        items: ["T-Shirts", "Shirt", "Hoodies", "Sweatshirt", "Jeans","Track Suit", "Trouser", "Jacket"],
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop"
      }
    ],
    promoImg: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=500&fit=crop",
    promoLink: "/men/sale",
    promoText: "Trending Now"
  },
  women: {
    label: "Women",
    categories: [
      { 
        title: "Clothing", 
        items: ["T-Shirts", "Tops", "Hoodies", "Sweatshirt", "Dress", "Jeans", "Track Suit", "Trouser", "Skirt"],
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"
      }
    ],
    promoImg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop",
    promoLink: "/women/sale",
    promoText: "New Arrivals"
  },
  accessories: {
    label: "Accessories",
    categories: [
      { 
        title: "All Accessories", 
        items: ["CAP", "Belt", "Wallet", "Bag", "Socks"],
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&fit=crop"
      }
    ],
    promoImg: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop",
    promoLink: "/products",
    promoText: "Shop All"
  }
} as const

export type MenuKey = keyof typeof MENU_DATA
