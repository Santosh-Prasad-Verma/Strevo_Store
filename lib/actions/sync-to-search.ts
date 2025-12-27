'use server'

import { productsIndex } from '@/lib/meilisearch/client'

export async function syncProductToSearch(product: any) {
  try {
    const document = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      gender: product.gender || '',
      brand: product.brand || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      subcategories: product.subcategories || [],
      tags: product.tags || [],
      images: product.images,
      in_stock: product.in_stock ?? true,
      popularity: product.popularity || 0,
      created_at: new Date(product.created_at).getTime(),
    }

    await productsIndex.addDocuments([document], { primaryKey: 'id' })
    return { success: true }
  } catch (error) {
    console.error('Failed to sync to search:', error)
    return { success: false, error }
  }
}

export async function deleteProductFromSearch(productId: string) {
  try {
    await productsIndex.deleteDocument(productId)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete from search:', error)
    return { success: false, error }
  }
}
