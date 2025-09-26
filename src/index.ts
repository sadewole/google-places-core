import { GooglePlacesManager, GooglePlacesManagerState } from './core/googlePlacesManager';
import { GooglePlacesWebService } from './services/googleMapWeb.service';
import { GooglePlacesNativeService } from './services/googleMapNative.service';

function createGooglePlacesManager(
  apiKey: string,
  platform: 'web' | 'native' = 'web',
  options?: { debounceTime?: number, country?: string[] },
): GooglePlacesManager {
  const service = platform === 'web'
    ? new GooglePlacesWebService(apiKey, options?.country)
    : new GooglePlacesNativeService(apiKey, options?.country);
    
  return new GooglePlacesManager(service, options?.debounceTime);
}

export * from './types';

export {  createGooglePlacesManager,
  GooglePlacesManager,
  GooglePlacesWebService,
  GooglePlacesNativeService, GooglePlacesManagerState}