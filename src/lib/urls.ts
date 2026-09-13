/**
 * Centralized safe URL configuration and helper for IndiaWise AI and production-facing links.
 * Guarantees that localhost is NEVER returned in production-facing AI links.
 */

const FALLBACK_PRODUCTION_URL = 'https://indiawise.vercel.app';

/**
 * Returns the safe production base URL.
 * Falls back to 'https://indiawise.vercel.app' if NEXT_PUBLIC_SITE_URL is unset,
 * or if it contains localhost/127.0.0.1.
 */
export function getProductionBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    // Never allow localhost or 127.0.0.1 in production-facing links
    if (!trimmed.includes('localhost') && !trimmed.includes('127.0.0.1')) {
      return trimmed;
    }
  }
  return FALLBACK_PRODUCTION_URL;
}

/**
 * Constructs a safe production URL for any path.
 * Avoids double URL encoding and ensures single leading slash.
 */
export function getSafeProductionUrl(path: string): string {
  const base = getProductionBaseUrl();
  if (!path) return base;
  
  // If already absolute production URL, ensure clean format
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Replace any localhost base with production base
    return path.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, base);
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Prevent double URL encoding: decode first, then encode URI cleanly
  try {
    const decoded = decodeURI(cleanPath);
    return `${base}${encodeURI(decoded)}`;
  } catch {
    return `${base}${cleanPath}`;
  }
}

/**
 * Sanitizes AI response text to ensure no localhost URLs, internal development URLs,
 * or server secrets leak into production-facing AI responses.
 */
export function sanitizeAIResponseUrls(text: string): string {
  if (!text) return text;
  const prodBase = getProductionBaseUrl();

  // Replace any http(s)://localhost(:port) or http(s)://127.0.0.1(:port) with the production base URL
  let sanitized = text.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/gi, prodBase);

  // Redact GEMINI_API_KEY if present in output
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.length > 5) {
    sanitized = sanitized.split(apiKey).join('[REDACTED]');
  }

  return sanitized;
}
