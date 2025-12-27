-- ============================================
-- ANALYZE SLOW QUERIES - Safe Version
-- ============================================

-- 1. Find tables with most sequential scans (likely missing indexes)
SELECT 
    schemaname,
    relname as table_name,
    seq_scan,
    seq_tup_read,
    idx_scan,
    CASE 
        WHEN seq_scan > 0 THEN ROUND(seq_tup_read::numeric / seq_scan, 2)
        ELSE 0
    END as avg_seq_read
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 20;

-- 2. Find unused indexes (wasting space)
SELECT 
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;

-- 3. Find tables needing VACUUM
SELECT 
    schemaname,
    relname as table_name,
    n_dead_tup,
    n_live_tup,
    CASE 
        WHEN n_live_tup > 0 THEN ROUND(100.0 * n_dead_tup / n_live_tup, 2)
        ELSE 0
    END as dead_pct,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND n_dead_tup > 100
ORDER BY n_dead_tup DESC;

-- 4. Find table sizes
SELECT 
    t.tablename,
    pg_size_pretty(pg_total_relation_size(quote_ident(t.schemaname)||'.'||quote_ident(t.tablename))) as total_size,
    pg_size_pretty(pg_relation_size(quote_ident(t.schemaname)||'.'||quote_ident(t.tablename))) as table_size
FROM pg_tables t
WHERE t.schemaname = 'public'
ORDER BY pg_total_relation_size(quote_ident(t.schemaname)||'.'||quote_ident(t.tablename)) DESC
LIMIT 10;

-- 5. Check current active queries
SELECT 
    pid,
    now() - query_start as duration,
    state,
    LEFT(query, 100) as query
FROM pg_stat_activity
WHERE state != 'idle'
  AND query NOT LIKE '%pg_stat_activity%'
ORDER BY query_start;

-- 6. Check index usage summary
SELECT 
    schemaname,
    relname as table_name,
    COUNT(*) as index_count,
    SUM(idx_scan) as total_index_scans,
    SUM(CASE WHEN idx_scan = 0 THEN 1 ELSE 0 END) as unused_indexes
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
GROUP BY schemaname, relname
ORDER BY unused_indexes DESC, total_index_scans ASC;
