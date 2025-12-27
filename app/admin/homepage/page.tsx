"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getHomepageContent, updateHomepageContent, type HomepageContent } from "@/lib/actions/homepage"
import { toast } from "sonner"

export default function HomepageManagement() {
  const [content, setContent] = useState<HomepageContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    try {
      const data = await getHomepageContent()
      setContent(data)
    } catch (error) {
      toast.error("Failed to load content")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(id: string, field: string, value: string) {
    try {
      await updateHomepageContent(id, { [field]: value })
      toast.success("Updated successfully")
      loadContent()
    } catch (error) {
      toast.error("Update failed")
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Homepage Content Management</h1>
      
      <div className="grid gap-6">
        {content.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg uppercase">{item.section.replace(/_/g, " ")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Media URL ({item.media_type})</Label>
                <Input
                  defaultValue={item.media_url}
                  onBlur={(e) => handleUpdate(item.id, "media_url", e.target.value)}
                  placeholder="Enter URL or /path/to/file.mp4"
                />
              </div>
              
              {item.title !== null && (
                <div>
                  <Label>Title</Label>
                  <Input
                    defaultValue={item.title || ""}
                    onBlur={(e) => handleUpdate(item.id, "title", e.target.value)}
                  />
                </div>
              )}
              
              <div>
                <Label>Description</Label>
                <Input
                  defaultValue={item.description || ""}
                  onBlur={(e) => handleUpdate(item.id, "description", e.target.value)}
                />
              </div>
              
              <div>
                <Label>Link URL</Label>
                <Input
                  defaultValue={item.link_url || ""}
                  onBlur={(e) => handleUpdate(item.id, "link_url", e.target.value)}
                />
              </div>
              
              <div>
                <Label>Button Text</Label>
                <Input
                  defaultValue={item.button_text || ""}
                  onBlur={(e) => handleUpdate(item.id, "button_text", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
