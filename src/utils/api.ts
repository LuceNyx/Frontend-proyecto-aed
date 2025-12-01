export type CheckResponse = {
  malicious: boolean
  reason?: string
}

// Llama al endpoint del backend para comprobar una URL.
// Por defecto apunta a `/api/check`. Ajusta el endpoint si tu backend está en otra ruta/host.
export async function checkUrl(url: string, endpoint = '/api/check'): Promise<CheckResponse> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json()
  return data as CheckResponse
}

// Nota: Si deseas probar el frontend sin backend, crea un pequeño proxy o mock
// que responda a POST /api/check con JSON { malicious: boolean }.
