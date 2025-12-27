# Meilisearch Setup Guide

## 1. Install Dependencies

```bash
npm install meilisearch tsx
```

## 2. Start Meilisearch Server

### Option A: Docker (Recommended)
```bash
docker run -d \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY=your_master_key_here \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v1.5
```

### Option B: Direct Install
Download from https://www.meilisearch.com/docs/learn/getting_started/installation

```bash
./meilisearch --master-key=your_master_key_here
```

## 3. Configure Environment Variables

Add to `.env.local`:

```env
# Meilisearch
MEILI_HOST=http://127.0.0.1:7700
MEILI_MASTER_KEY=your_master_key_here
MEILI_SEARCH_KEY=your_search_key_here
```

## 4. Generate Search-Only API Key

Run in terminal:
```bash
curl -X POST 'http://127.0.0.1:7700/keys' \
  -H 'Authorization: Bearer your_master_key_here' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "description": "Search-only key",
    "actions": ["search"],
    "indexes": ["products"],
    "expiresAt": null
  }'
```

Copy the returned `key` value to `MEILI_SEARCH_KEY` in `.env.local`

## 5. Initial Bulk Sync

```bash
npm run meili:setup
```

This will:
- Create the `products` index
- Apply settings from `meilisearch/index-settings.json`
- Index all products from Supabase

## 6. Start Realtime Sync (Optional)

In a separate terminal:
```bash
npm run meili:sync
```

This keeps Meilisearch in sync with Supabase changes in real-time.

## 7. Verify Setup

```bash
curl 'http://127.0.0.1:7700/indexes/products/search' \
  -H 'Authorization: Bearer your_search_key_here' \
  -H 'Content-Type: application/json' \
  --data-binary '{"q": "shirt"}'
```

## Troubleshooting

### Connection refused
- Ensure Meilisearch is running on port 7700
- Check firewall settings

### Authentication error
- Verify MEILI_MASTER_KEY matches server key
- Regenerate search key if needed

### No results
- Run bulk sync: `npm run meili:setup`
- Check products exist in Supabase

## Performance Tips

- Index updates are async (check task status)
- Use facets for filter counts
- Enable typo tolerance for better UX
- Monitor index size with `/indexes/products/stats`
