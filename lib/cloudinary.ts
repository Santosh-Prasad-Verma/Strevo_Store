// Cloudinary upload helper - stub implementation
// Install cloudinary package if needed: npm install cloudinary

export async function uploadToCloudinary(_file: File): Promise<string | null> {
  // Cloudinary not configured - return null
  // To enable: npm install cloudinary and configure env vars
  console.warn('Cloudinary not configured - image upload disabled')
  return null
}
