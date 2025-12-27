#!/bin/bash
# Benchmark script for search suggestions API

echo "=== Search Suggestions Performance Benchmark ==="
echo ""

# Test 1: Prefix search (t shirt)
echo "Test 1: Prefix search 't shirt'"
npx autocannon -c 50 -d 10 http://localhost:3000/api/search/suggest-fast?q=t%20shirt

echo ""
echo "Test 2: Single character 't'"
npx autocannon -c 50 -d 10 http://localhost:3000/api/search/suggest-fast?q=t

echo ""
echo "Test 3: Typo 'tshrt'"
npx autocannon -c 50 -d 10 http://localhost:3000/api/search/suggest-fast?q=tshrt

echo ""
echo "Test 4: Empty query (popular products)"
npx autocannon -c 50 -d 10 http://localhost:3000/api/search/suggest-fast?q=

echo ""
echo "=== Benchmark Complete ==="
