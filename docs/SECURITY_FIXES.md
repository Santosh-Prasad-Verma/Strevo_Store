# 🔒 Security Issues Fix Guide

This document addresses the **73 security and performance issues** identified in your Supabase database.

## 🚨 Issues Identified

### Security Issues (6)
1. **Function search_path vulnerabilities** - 4 functions with mutable search_path
2. **pg_trgm extension in public schema** - Should be moved to extensions schema  
3. **HaveIBeenPwned integration disabled** - Compromised password checking not enabled

### Performance Issues (67)
- Missing indexes on search columns
- Inefficient query patterns
- Lack of proper constraints
- Unoptimized RLS policies

## 🛠️ Fix Implementation

### Step 1: Run Security Fixes
Execute the main security script in Supabase SQL Editor:

```sql
-- Run this file in Supabase Dashboard > SQL Editor
scripts/016_fix_security_issues.sql
```

**What this fixes:**
- ✅ Secures all functions with proper `search_path`
- ✅ Moves `pg_trgm` extension to secure schema
- ✅ Adds performance indexes
- ✅ Strengthens RLS policies
- ✅ Adds data integrity constraints
- ✅ Creates audit logging system

### Step 2: Enable Password Protection
Execute the password protection script:

```sql
-- Run this file in Supabase Dashboard > SQL Editor  
scripts/017_enable_password_protection.sql
```

**Manual Steps Required:**
1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Enable **"Check against HaveIBeenPwned database"**
3. Set password requirements:
   - Minimum 8 characters
   - Require uppercase letters
   - Require lowercase letters  
   - Require numbers

### Step 3: Verify Fixes
Run this query to check if fixes were applied:

```sql
-- Check function security
SELECT 
  routine_name,
  routine_schema,
  security_type,
  routine_definition LIKE '%search_path%' as has_search_path
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN ('log_admin_action', 'search_products', 'update_updated_at_column', 'generate_order_number');

-- Check extension location
SELECT 
  extname,
  nspname as schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE extname = 'pg_trgm';

-- Check indexes
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';
```

## 🎯 Expected Results

After running the fixes, you should see:

### Security Improvements
- ✅ **0 function search_path vulnerabilities**
- ✅ **pg_trgm moved to extensions schema**
- ✅ **HaveIBeenPwned protection enabled**
- ✅ **Stronger RLS policies**
- ✅ **Audit logging active**

### Performance Improvements  
- ✅ **67 performance issues resolved**
- ✅ **Optimized search queries**
- ✅ **Proper database indexes**
- ✅ **Data integrity constraints**

## 🔍 Monitoring

### Check Security Status
```sql
-- Monitor failed login attempts
SELECT COUNT(*) as failed_attempts
FROM auth.audit_log_entries 
WHERE event_type = 'user_signinup_failed'
AND created_at > NOW() - INTERVAL '24 hours';

-- Check password violations
SELECT violation_type, COUNT(*) as count
FROM password_policy_violations
WHERE attempted_at > NOW() - INTERVAL '7 days'
GROUP BY violation_type;
```

### Performance Monitoring
```sql
-- Check slow queries
SELECT 
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements 
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## ⚠️ Important Notes

1. **Backup First**: Always backup your database before running these scripts
2. **Test Environment**: Run on staging environment first
3. **Downtime**: Some operations may require brief downtime
4. **Permissions**: Ensure you have admin access to Supabase project

## 🚀 Post-Fix Actions

1. **Update Application Code**: Ensure your app handles new security constraints
2. **Monitor Performance**: Check query performance after index additions
3. **Review Logs**: Monitor audit logs for suspicious activity
4. **Update Documentation**: Document new security policies

## 📞 Support

If you encounter issues:
1. Check Supabase logs for error details
2. Verify all prerequisites are met
3. Run verification queries to confirm fixes
4. Contact Supabase support if needed

---

**Status**: Ready to implement
**Estimated Time**: 15-30 minutes
**Risk Level**: Low (with proper backup)