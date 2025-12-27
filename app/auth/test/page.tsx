"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestAuthPage() {
  const [status, setStatus] = useState('Testing connection...')
  const [error, setError] = useState('')

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setError(error.message)
          setStatus('Connection failed')
        } else {
          setStatus('Connection successful!')
        }
      } catch (err: any) {
        setError(err.message)
        setStatus('Connection failed')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
        <p className="text-lg">{status}</p>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        <div className="text-sm text-neutral-600">
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </div>
    </div>
  )
}
