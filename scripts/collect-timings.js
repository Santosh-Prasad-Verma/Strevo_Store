const axios = require('axios');

async function collect(url, n = 100) {
  console.log(`Collecting ${n} samples from ${url}...\n`);
  
  const results = [];
  let hits = 0;
  let misses = 0;
  const durations = [];

  for (let i = 0; i < n; i++) {
    try {
      const start = Date.now();
      const r = await axios.get(url);
      const duration = Date.now() - start;
      
      const cacheStatus = r.headers['x-cache-status'] || 'UNKNOWN';
      if (cacheStatus === 'HIT') hits++;
      if (cacheStatus === 'MISS') misses++;
      
      durations.push(duration);
      
      results.push({
        req: i + 1,
        status: r.status,
        duration: `${duration}ms`,
        serverTiming: r.headers['server-timing'] || 'N/A',
        cache: cacheStatus
      });
      
      if ((i + 1) % 10 === 0) {
        process.stdout.write(`Progress: ${i + 1}/${n}\r`);
      }
    } catch (error) {
      results.push({
        req: i + 1,
        status: 'ERROR',
        duration: 'N/A',
        serverTiming: 'N/A',
        cache: 'ERROR'
      });
    }
  }

  console.log('\n\n=== RESULTS ===\n');
  console.table(results.slice(0, 20)); // Show first 20
  
  durations.sort((a, b) => a - b);
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  
  console.log('\n=== STATISTICS ===');
  console.log(`Total Requests: ${n}`);
  console.log(`Cache Hits: ${hits} (${((hits/n)*100).toFixed(1)}%)`);
  console.log(`Cache Misses: ${misses} (${((misses/n)*100).toFixed(1)}%)`);
  console.log(`Avg Latency: ${avg.toFixed(2)}ms`);
  console.log(`P50 Latency: ${p50}ms`);
  console.log(`P95 Latency: ${p95}ms`);
  console.log(`P99 Latency: ${p99}ms`);
}

const url = process.argv[2] || 'http://localhost:3000/api/products?limit=4';
const count = parseInt(process.argv[3]) || 100;

collect(url, count);
