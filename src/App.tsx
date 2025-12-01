import { useState } from 'react'
import './App.css'
import { checkUrl } from './utils/api'

function App() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'result' | 'error'>('idle')
  const [isMalicious, setIsMalicious] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [timeMs, setTimeMs] = useState<number | null>(null)

  const onCheck = async () => {
    if (!url.trim()) return
    setStatus('checking')
    setIsMalicious(null)
    setMessage(null)
    setTimeMs(null)
    const start = performance.now()
    try {
      const res = await checkUrl(url.trim())
      const elapsed = performance.now() - start
      setTimeMs(Math.round(elapsed))
      // Expecting backend to return an object like { malicious: boolean, reason?: string }
      if (res && typeof res.malicious === 'boolean') {
        setIsMalicious(res.malicious)
        setMessage(res.reason || null)
        setStatus('result')
      } else {
        setMessage('Respuesta inesperada del servidor')
        setStatus('error')
      }
    } catch (err: any) {
      setMessage(err?.message || 'Error al conectar con el backend')
      setStatus('error')
    }
  }

  return (
    <div id="root">
      <h1>Comprobador de URLs (Bloom Filter)</h1>

      <div className="card checker">
        <label htmlFor="urlInput">Pega la URL a comprobar</label>
        <div className="inputRow">
          <input
            id="urlInput"
            type="text"
            placeholder="https://ejemplo.com/…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onCheck() }}
          />
          <button onClick={onCheck} className="primary" disabled={status === 'checking'}>
            {status === 'checking' ? 'Comprobando…' : 'Comprobar'}
          </button>
        </div>

        {status === 'result' && (
          <div className={`result ${isMalicious ? 'malicious' : 'safe'}`}>
            <strong>{isMalicious ? 'POSIBLEMENTE MALICIOSA' : 'NO ENCONTRADA (NO MALICIOSA)'}</strong>
            {isMalicious && (
              <div className="small">
                El resultado proviene de un Bloom Filter: si aparece como maliciosa, significa que "podría" pertenecer a la blacklist (posible falso positivo). Para confirmar, es necesario verificar contra la base de datos completa.
              </div>
            )}
            {message && <div className="small">{message}</div>}
            {timeMs != null && <div className="small">Tiempo: {timeMs} ms</div>}
          </div>
        )}

        {status === 'error' && (
          <div className="result error">
            <strong>Error</strong>
            {message && <div className="small">{message}</div>}
            <div className="small">Asegúrate de que el backend expone `/api/check` y permite CORS.</div>
          </div>
        )}

        <div className="hint">
          El frontend espera un endpoint POST en <code>/api/check</code> que reciba JSON {`{ url: string }`} y responda {`{ malicious: boolean, reason?: string }`}. El campo `malicious` proviene del Bloom Filter: `true` significa "posiblemente en la blacklist" (falsos positivos posibles). Si quieres una comprobación definitiva, añade al backend una comprobación contra la base de datos real y expónla como `/api/verify`.
        </div>
      </div>
    </div>
  )
}

export default App
