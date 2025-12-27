# 📁 Scripts Directory - Master Guide

This directory contains all database scripts organized by purpose. Follow this guide to understand what to run and when.

## 🚀 Quick Start - Run These in Order

### 1️⃣ Security Fixes (REQUIRED)
**File**: `fix-security-issues.sql`  
**Purpose**: Enable RLS on 54 tables, fix function security  
**Status**: ⚠️ Must run first  
**Docs**: `SECURITY_FIX_README.md`

```sql
-- Run in Supabase SQL Editor
-- Fixes: RLS, SECURITY DEFINER views, function search paths
```

### 2️⃣ Performance Optimization (REQUIRED)
**File**: `fix-performance-issues-safe.sql`  
**Purpose**: Optimize RLS policies, remove duplicate indexes  
**Status**: ⚠️ Run after security fixes  
**Docs**: `PERFORMANCE_FIX_README.md`

```sql
-- Run in Supabase SQL Editor
-- Fixes: auth.uid() optimization, duplicate policies
```

### 3️⃣ Query Optimization (RECOMMENDED)
**File**: `optimize-slow-queries-safe.sql`  
**Purpose**: Add missing indexes, update statistics  
**Status**: ✅ Run to fix slow queries  
**Docs**: `QUERY_OPTIMIZATION_README.md`

```sql
-- Run in Supabase SQL Editor
-- Fixes: Missing indexes, slow queries
```

---

## 📂 Directory Structure

### 🔧 Initial Setup (Already Done)
```
001_create_tables.sql           - Database schema
002_create_rls_policies.sql     - Row level security
003_create_functions_triggers.sql - Database functions
004_seed_products.sql           - Sample data
005_setup_search.sql            - Search configuration
```

### 🔒 Security & Performance (Run These)
```
fix-security-issues.sql         - ⚠️ PRIORITY 1
fix-performance-issues-safe.sql - ⚠️ PRIORITY 2
optimize-slow-queries-safe.sql  - ⚠️ PRIORITY 3
```

### 📊 Analysis Tools
```
analyze-slow-queries.sql        - Identify slow queries
check-schema.sql                - Check table columns
```

### 🗑️ Optional/Deprecated (Don't Run)
```
fix-performance-issues.sql      - Use "safe" version instead
optimize-slow-queries.sql       - Use "safe" version instead
vacuum-tables.sql               - Auto-vacuum handles this
```

### 📚 Documentation
```
SECURITY_FIX_README.md          - Security guide
PERFORMANCE_FIX_README.md       - Performance guide
QUERY_OPTIMIZATION_README.md    - Query optimization guide
```

### 🔍 Search & Cache (Meilisearch)
```
meili-bulk-sync.ts              - Bulk sync products
meili-realtime-sync.ts          - Real-time sync
meili_index_settings.json       - Search settings
```

### 📈 Monitoring
```
monitor-cache.ts                - Cache monitoring
warm-cache.prod.ts              - Cache warming
```

---

## ✅ What You Need to Do Now

### Step 1: Security Fixes
```bash
# In Supabase SQL Editor
1. Open: fix-security-issues.sql
2. Copy all content
3. Run in SQL Editor
4. Verify: No RLS warnings in Supabase dashboard
```

### Step 2: Performance Fixes
```bash
# In Supabase SQL Editor
1. Open: fix-performance-issues-safe.sql
2. Copy all content
3. Run in SQL Editor
4. Verify: Check performance advisor
```

### Step 3: Query Optimization
```bash
# In Supabase SQL Editor
1. Open: optimize-slow-queries-safe.sql
2. Copy all content
3. Run in SQL Editor
4. Verify: Slow queries should decrease
```

### Step 4: Manual Tasks
```bash
# In Supabase Dashboard
1. Go to Authentication > Settings
2. Enable "Check for compromised passwords"
3. Save changes
```

---

## 📊 Current Issues Summary

| Issue | Count | Fix Script | Status |
|-------|-------|------------|--------|
| Tables without RLS | 54 | fix-security-issues.sql | ⚠️ Required |
| Slow RLS policies | 67 | fix-performance-issues-safe.sql | ⚠️ Required |
| Slow queries | 48 | optimize-slow-queries-safe.sql | ⚠️ Required |
| Function security | 60+ | fix-security-issues.sql | ⚠️ Required |
| Duplicate indexes | 13+ | fix-performance-issues-safe.sql | ⚠️ Required |

---

## 🎯 Expected Results

### After Security Fixes
- ✅ All tables have RLS enabled
- ✅ No security warnings in Supabase
- ✅ Functions have secure search paths
- ✅ Views are properly secured

### After Performance Fixes
- ✅ RLS policies 10-100x faster
- ✅ No duplicate policies
- ✅ Reduced index storage
- ✅ Better query performance

### After Query Optimization
- ✅ Slow queries: 48 → <10
- ✅ Proper indexes on all tables
- ✅ Updated table statistics
- ✅ Faster page loads

---

## 🚫 Files You Can Ignore

These are old/deprecated/optional:
- `check-table-schemas.sql` - Analysis only
- `vacuum-tables.sql` - Auto-vacuum handles this
- `fix-performance-issues.sql` - Use "safe" version
- `optimize-slow-queries.sql` - Use "safe" version
- `FIX_VIEW_SECURITY.sql` - Included in main fix
- `FINAL_DATABASE_OPTIMIZATION.sql` - Old version
- All `*_SCHEMA.sql` files - Already applied

---

## 📞 Need Help?

1. **Security Issues**: Read `SECURITY_FIX_README.md`
2. **Performance Issues**: Read `PERFORMANCE_FIX_README.md`
3. **Slow Queries**: Read `QUERY_OPTIMIZATION_README.md`

---

## 🔄 Maintenance Schedule

### Daily
- Monitor slow queries in Supabase dashboard
- Check error logs

### Weekly
- Run `analyze-slow-queries.sql` to check performance
- Review cache hit rates

### Monthly
- Review and optimize new queries
- Check for unused indexes
- Update table statistics

---

**Last Updated**: Today  
**Priority**: Run security and performance fixes ASAP!
