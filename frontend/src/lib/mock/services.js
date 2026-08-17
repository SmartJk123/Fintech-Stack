// EliteWallet service layer now lives in @/lib/api/services (configurable:
// routes to your Spring Boot API when VITE_API_BASE_URL is set, mock fallback otherwise).
// This file re-exports that layer so existing imports keep working unchanged.
export * from '@/lib/api/services';