"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CacheManagerPage() {
  const [loading, setLoading] = useState(false);

  const clearCache = async (type: string) => {
    setLoading(true);
    await fetch(`/api/admin/cache/clear?type=${type}`, { method: "POST" });
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Cache Manager</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Cache</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">Clear cached product data</p>
            <Button onClick={() => clearCache("products")} disabled={loading}>
              Clear Product Cache
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Cache</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">Clear cached category data</p>
            <Button onClick={() => clearCache("categories")} disabled={loading}>
              Clear Category Cache
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Cache</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">Clear Meilisearch cache</p>
            <Button onClick={() => clearCache("search")} disabled={loading}>
              Clear Search Cache
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Cache</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">Clear all cached data</p>
            <Button onClick={() => clearCache("all")} disabled={loading} variant="destructive">
              Clear All Cache
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
