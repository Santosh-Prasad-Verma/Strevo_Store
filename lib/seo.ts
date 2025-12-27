import { Metadata } from "next";

export function generateMetadata({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image?: string;
  url?: string;
}): Metadata {
  const siteName = "Strevo Store";
  const fullTitle = `${title} | ${siteName}`;
  const defaultImage = "https://aqntafbibqwkiqmihpws.supabase.co/storage/v1/object/public/Media/og-image.jpg";

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: [image || defaultImage],
      url: url || "https://strevo.com",
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image || defaultImage],
    },
  };
}

export function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
}
