#!/usr/bin/env node
/**
 * Search Suggestions Benchmark Script
 * Measures p50, p95, p99 latencies for typeahead suggestions
 * 
 * Usage:
 *   node scripts/benchmark-search.js
 *   node scripts/benchmark-search.js --url https://staging.example.com
 *   node scripts/benchmark-search.js --iterations 500
 */

const https = require('https')
const http = require('http')

// Configuration
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  iterations: 200,
  queries: [
    't shirt',
    't-shirt',
    'tshirt',
    'hoodie',
    'jeans',
    'jacket',
    'dress',
    'sneakers',
    'bag',
    'xyz123', // No results test
  ],
}

// Parse CLI args
process.argv.slice(2).forEach((arg, i, args) => {
  if (arg === '--url' && args[i + 1]) {
    config.baseUrl = args[i + 1]
  } else if (arg === '--iterations' && args[i + 1]) {
    config.iterations = parseInt(args[i + 1], 10)
  }
})

async function fetchSuggestion(query) {
  const url = `${config.baseUrl}/api/search/suggest?q=${encodeURIComponent(query)}&limit=6`
  const start = Date.now()
  
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    
    const req = client.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        const duration = Date.now() - start
        const cacheStatus = res.headers['x-cache-status'] || 'UNKNOWN'
        
        try {
          const json = JSON.parse(data)
          resolve({
            duration,
            cacheStatus,
            resultCount: json.suggestions?.length || 0,
            serverTime: json.timeMs,
          })
        } catch (e) {
          resolve({ duration, cacheStatus, resultCount: 0, error: true })
        }
      })
    })
    
    req.on('error', (e) => {
      resolve({ duration: Date.now() - start, error: e.message })
    })
    
    req.setTimeout(5000, () => {
      req.destroy()
      resolve({ duration: 5000, error: 'timeout' })
    })
  })
}

function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

async function runBenchmark() {
  console.log('🔍 Search Suggestions Benchmark')
  console.log('================================')
  console.log(`Base URL: ${config.baseUrl}`)
  console.log(`Iterations per query: ${config.iterations}`)
  console.log(`Test queries: ${config.queries.length}`)
  console.log('')
  
  const allResults = []
  const cacheHits = { HIT: 0, MISS: 0, UNKNOWN: 0 }
  
  for (const query of config.queries) {
    console.log(`Testing: "${query}"`)
    const queryResults = []
    
    for (let i = 0; i < config.iterations; i++) {
      const result = await fetchSuggestion(query)
      queryResults.push(result.duration)
      allResults.push(result)
      cacheHits[result.cacheStatus] = (cacheHits[result.cacheStatus] || 0) + 1
      
      // Progress indicator
      if ((i + 1) % 50 === 0) {
        process.stdout.write('.')
      }
    }
    
    const p50 = percentile(queryResults, 50)
    const p95 = percentile(queryResults, 95)
    const p99 = percentile(queryResults, 99)
    
    console.log(`\n  p50: ${p50}ms | p95: ${p95}ms | p99: ${p99}ms`)
  }
  
  // Overall stats
  const allDurations = allResults.map(r => r.duration)
  const totalRequests = allResults.length
  const errors = allResults.filter(r => r.error).length
  
  console.log('\n================================')
  console.log('📊 Overall Results')
  console.log('================================')
  console.log(`Total requests: ${totalRequests}`)
  console.log(`Errors: ${errors} (${((errors / totalRequests) * 100).toFixed(2)}%)`)
  console.log(`Cache hits: ${cacheHits.HIT} (${((cacheHits.HIT / totalRequests) * 100).toFixed(1)}%)`)
  console.log(`Cache misses: ${cacheHits.MISS} (${((cacheHits.MISS / totalRequests) * 100).toFixed(1)}%)`)
  console.log('')
  console.log(`p50: ${percentile(allDurations, 50)}ms`)
  console.log(`p95: ${percentile(allDurations, 95)}ms`)
  console.log(`p99: ${percentile(allDurations, 99)}ms`)
  console.log(`min: ${Math.min(...allDurations)}ms`)
  console.log(`max: ${Math.max(...allDurations)}ms`)
  console.log(`avg: ${Math.round(allDurations.reduce((a, b) => a + b, 0) / allDurations.length)}ms`)
  
  // Acceptance criteria check
  console.log('\n================================')
  console.log('✅ Acceptance Criteria Check')
  console.log('================================')
  
  const coldP95 = percentile(
    allResults.filter(r => r.cacheStatus === 'MISS').map(r => r.duration),
    95
  )
  const cachedP95 = percentile(
    allResults.filter(r => r.cacheStatus === 'HIT').map(r => r.duration),
    95
  )
  
  console.log(`Cold query p95: ${coldP95}ms ${coldP95 < 300 ? '✅' : '❌'} (target: <300ms)`)
  console.log(`Cached query p95: ${cachedP95}ms ${cachedP95 < 120 ? '✅' : '❌'} (target: <120ms)`)
  console.log(`Cache hit ratio: ${((cacheHits.HIT / totalRequests) * 100).toFixed(1)}%`)
}

runBenchmark().catch(console.error)
