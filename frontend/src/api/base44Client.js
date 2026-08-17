// Base44 platform client for the EliteWallet prototype.
// On Base44 this module is generated per app; this is the local equivalent so
// auth and function calls resolve without the hosted platform.
import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

export const base44 = createClient({
  appId: appParams.appId || '',
  token: appParams.token || undefined,
  appBaseUrl: appParams.appBaseUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
  functionsVersion: appParams.functionsVersion || undefined,
});
