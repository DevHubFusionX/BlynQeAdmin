/**
 * src/api/client.js
 *
 * Base HTTP client for the admin desktop app.
 *
 * All API responses follow the envelope:
 *   { error: boolean, message: string, data: any }
 *
 * This client:
 *  - Reads the base URL from VITE_API_URL
 *  - Attaches the Bearer token from Zustand authStore automatically
 *  - Throws a structured ApiError when `error === true` or HTTP is non-2xx
 *  - Returns `data` unwrapped so callers never touch the envelope
 */

import { useAuthStore } from '../store/authStore.js'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

// ─── Error class ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(message, statusCode, raw) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.raw = raw
  }
}

// ─── Core request ────────────────────────────────────────────────────────────

async function request(endpoint, { method = 'GET', body, params, headers = {} } = {}) {
  const token = useAuthStore.getState().token

  // Build URL — append query params safely without needing an absolute base
  let fullUrl = `${BASE_URL}${endpoint}`
  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) qs.set(k, String(v))
    })
    fullUrl += `?${qs.toString()}`
  }

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }

  if (body !== undefined) {
    config.body = JSON.stringify(body)
  }

  console.log(`%c[API Request] ${method} %c${fullUrl}`, 'color: #f97316; font-weight: bold;', 'color: #38bdf8;', {
    body,
    headers: config.headers,
  })

  let res
  try {
    res = await fetch(fullUrl, config)
  } catch (networkErr) {
    console.error(`%c[API Network Error] ${method} ${fullUrl}`, 'color: #ef4444; font-weight: bold;', networkErr)
    throw new ApiError('Network error — check your connection.', 0, networkErr)
  }

  // Parse JSON (or fall back gracefully)
  let json
  try {
    json = await res.json()
  } catch {
    console.error(`%c[API Non-JSON Response] ${method} ${fullUrl} (Status ${res.status})`, 'color: #ef4444; font-weight: bold;')
    throw new ApiError(`Non-JSON response (${res.status})`, res.status, null)
  }

  // Your API signals failure via the `error` boolean in the envelope
  if (!res.ok || json.error === true) {
    console.error(`%c[API Error Response] ${method} ${fullUrl} (Status ${res.status})`, 'color: #ef4444; font-weight: bold;', json)
    if (res.status === 401) {
      useAuthStore.getState().clearAuth()
    }
    throw new ApiError(
      json.message ?? `Request failed (${res.status})`,
      res.status,
      json,
    )
  }

  console.log(`%c[API Success] ${method} ${fullUrl} (Status ${res.status})`, 'color: #22c55e; font-weight: bold;', json)

  // Return the unwrapped payload
  return json.data ?? json
}

// ─── Verb helpers ─────────────────────────────────────────────────────────────

export const api = {
  get:    (url, opts)  => request(url, { method: 'GET',    ...opts }),
  post:   (url, body)  => request(url, { method: 'POST',   body }),
  put:    (url, body)  => request(url, { method: 'PUT',    body }),
  patch:  (url, body)  => request(url, { method: 'PATCH',  body }),
  delete: (url, body)  => request(url, { method: 'DELETE', body }),
}
