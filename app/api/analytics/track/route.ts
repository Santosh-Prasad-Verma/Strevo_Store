import { NextRequest, NextResponse } from 'next/server'

interface TrackingEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

interface TrackingPayload {
  events: TrackingEvent[]
}

export async function POST(request: NextRequest) {
  try {
    const payload: TrackingPayload = await request.json()
    
    if (!payload.events || !Array.isArray(payload.events)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Process events
    for (const event of payload.events) {
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${event.event}`, event.properties)
      }

      // Here you would send to your analytics service:
      // - Amplitude: amplitude.track(event.event, event.properties)
      // - Mixpanel: mixpanel.track(event.event, event.properties)
      // - Google Analytics: gtag('event', event.event, event.properties)
      // - Custom: await supabase.from('analytics_events').insert(event)
    }

    return NextResponse.json({ success: true, count: payload.events.length })
  } catch (error) {
    console.error('[Analytics] Error processing events:', error)
    return NextResponse.json({ error: 'Failed to process events' }, { status: 500 })
  }
}

// Handle beacon requests (sent on page unload)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
