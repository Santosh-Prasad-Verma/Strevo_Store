"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface AvatarUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AvatarUploadDialog({ open, onOpenChange, onSuccess }: AvatarUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      
      if (!res.ok) {
        console.error("Upload error:", data)
        throw new Error(data.error || "Upload failed")
      }

      toast({ title: "Avatar updated successfully" })
      setFile(null)
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      console.error("Upload failed:", error)
      toast({ title: error.message || "Failed to upload avatar", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="rounded-none"
          />
          {file && (
            <div className="text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={!file || uploading} className="rounded-none">
              {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Upload
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-none">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
