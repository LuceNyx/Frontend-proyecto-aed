# API del Backend (Bloom Filter)

El frontend espera que exista un endpoint para comprobar URLs maliciosas.

- **Endpoint (POST):** `/api/check`
- **Request (JSON):** `{ "url": "https://ejemplo.com/..." }`
- **Response (JSON):** `{ "malicious": true|false, "reason"?: "texto opcional" }`

Nota sobre el significado de `malicious` cuando se usa un Bloom Filter:

- Si `malicious: true` => el Bloom Filter indica que la URL *podría* estar en la blacklist (posible falso positivo). No es una confirmación absoluta.
- Si `malicious: false` => la URL definitivamente NO está en la blacklist (Bloom filters no dan falsos negativos para elementos previamente insertados correctamente).

Si necesitas una verificación definitiva, añade al backend una comprobación adicional contra la estructura de datos completa (por ejemplo un `unordered_set` o base de datos) y expónla como `/api/verify`.

Durante el desarrollo el servidor de Vite está configurado para proxear `/api` al backend que corre en `http://0.0.0.0:18080`.

Ejemplo para probar manualmente:

```bash
curl -X POST http://localhost:18080/api/check \
  -H "Content-Type: application/json" \
  -d '{"url":"http://secure-login-example.xyz"}'
```

Si tu backend está en otro host/puerto, actualiza `vite.config.ts` o el helper en `src/utils/api.ts`.

Nota: si necesitas un mock quick para probar sin el backend, puedo añadir un pequeño servidor Express en `scripts/mock-server.js`.
