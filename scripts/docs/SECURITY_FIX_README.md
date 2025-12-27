# 🔒 Security Issues Fix Guide

This guide will help you fix all the security issues reported by Supabase.

## 📋 Issues Fixed

- ✅ **54 tables** - RLS enabled
- ✅ **3 views** - SECURITY DEFINER removed
- ✅ **60+ functions** - Mutable search_path fixed
- ✅ **2 materialized views** - Access restricted
- ⚠️ **HIBP password check** - Manual enable required

## 🚀 How to Apply

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `fix-security-issues.sql`
5. Paste and click **Run**

### Option 2: Supabase CLI

```bash
# Make sure you're in the project directory
cd Strevo_Store

# Run the migration
supabase db execute -f scripts/fix-security-issues.sql
```

### Option 3: psql Command Line

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f scripts/fix-security-issues.sql
```

## ⚠️ Manual Step Required

### Enable HIBP Password Check

The compromised password check must be enabled manually:

1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Security and Protection**
4. Enable **"Check for compromised passwords"**
5. Save changes

This will check user passwords against the HaveIBeenPwned database.

## 🔍 Verify Changes

After running the script, verify the fixes:

```sql
-- Check RLS is enabled on all tables
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = false;
-- Should return 0 rows

-- Check policies exist
SELECT COUNT(*) 
FROM pg_policies 
WHERE schemaname = 'public';
-- Should return 108+ policies (2 per table)
```

## 📝 What Was Changed

### 1. Row Level Security (RLS)
- Enabled RLS on all 54 tables
- Created admin policies for service_role
- Created public read policies for anon/authenticated users

### 2. Security Definer Views
- Recreated views without SECURITY DEFINER
- `index_usage_stats`
- `database_health_dashboard`
- `slow_queries_monitor`

### 3. Function Search Paths
- Set explicit `search_path = public, pg_temp` on all functions
- Prevents search_path hijacking attacks

### 4. Materialized Views
- Revoked access from anon/authenticated roles
- Granted access only to service_role
- `schema_objects_cache`
- `table_definitions_cache`

## 🛡️ Security Best Practices

After applying these fixes:

1. **Review RLS policies** - Customize policies based on your business logic
2. **Test access** - Verify users can only access their own data
3. **Monitor logs** - Check for unauthorized access attempts
4. **Regular audits** - Run Supabase security advisor monthly

## 🔄 Rollback (If Needed)

If you need to rollback:

```sql
-- Disable RLS on a specific table
ALTER TABLE public.table_name DISABLE ROW LEVEL SECURITY;

-- Drop policies
DROP POLICY IF EXISTS admin_all ON public.table_name;
DROP POLICY IF EXISTS public_read ON public.table_name;
```

## 📞 Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Review the verification queries at the end of the script
3. Consult [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

---

**⚠️ Important**: Always backup your database before running migrations!
