import { createClient } from '@/lib/supabase/client'

export async function uploadToStorage(file: File, folder: string = 'products') {
  const supabase = createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(data.path)

  return publicUrl
}

export async function deleteFromStorage(url: string) {
  const supabase = createClient()
  
  const path = url.split('/media/')[1]
  if (!path) throw new Error('Invalid storage URL')

  const { error } = await supabase.storage
    .from('media')
    .remove([path])

  if (error) throw error
  return true
}

export function getStorageUrl(path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`
}
