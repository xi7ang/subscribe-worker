export default {
  async fetch(request, env) {
    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { email } = body || {}

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Trigger GitHub repository dispatch
    const dispatchRes = await fetch(
      `https://api.github.com/repos/mswnzl/xi7ang.github.io/dispatches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'devmini-subscribe-worker'
        },
        body: JSON.stringify({
          event_type: 'subscribe',
          client_payload: { email }
        })
      }
    )

    if (dispatchRes.status === 204 || dispatchRes.status === 200) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      const errText = await dispatchRes.text().catch(() => 'Unknown error')
      return new Response(JSON.stringify({ success: false, error: 'GitHub API error: ' + dispatchRes.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}