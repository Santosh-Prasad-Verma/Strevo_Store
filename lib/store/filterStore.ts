import { create } from 'zustand'
import type { ProductFilters, FilterResponse } from '@/lib/types/filters'

interface FilterStore {
  filters: ProductFilters
  response: FilterResponse | null
  isLoading: boolean
  isMobileOpen: boolean
  
  setFilters: (filters: Partial<ProductFilters>) => void
  setResponse: (response: FilterResponse) => void
  setLoading: (loading: boolean) => void
  toggleMobile: () => void
  reset: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: {
    page: 1,
    limit: 24,
    sort: 'newest',
  },
  response: null,
  isLoading: false,
  isMobileOpen: false,
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters, page: 1 }
  })),
  
  setResponse: (response) => set({ response }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  
  reset: () => set({
    filters: { page: 1, limit: 24, sort: 'newest' },
    response: null,
  }),
}))
