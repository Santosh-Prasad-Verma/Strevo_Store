import { delCache as deleteCache } from './redis'

export async function invalidateCart(userId: string) {
  await deleteCache(`cart:${userId}`)
}

export async function invalidateWishlist(userId: string) {
  await deleteCache(`wishlist:${userId}`)
}

export async function invalidateProfile(userId: string) {
  await deleteCache(`profile:${userId}`)
}

export async function invalidateDashboardStats() {
  await deleteCache('admin:dashboard:stats')
}
