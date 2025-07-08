import { GooglePlacesManager, GooglePlacesManagerState } from './core/googlePlacesManager';
import { GooglePlacesWebService } from './services/googleMapWeb.service';
import { GooglePlacesNativeService } from './services/GoogleMapNative.service';

function createGooglePlacesManager(
  apiKey: string,
  platform: 'web' | 'native' = 'web',
  options?: { debounceTime?: number }
): GooglePlacesManager {
  const service = platform === 'web'
    ? new GooglePlacesWebService(apiKey)
    : new GooglePlacesNativeService(apiKey);
    
  return new GooglePlacesManager(service, options?.debounceTime);
}

export * from './types';

export {  createGooglePlacesManager,
  GooglePlacesManager,
  GooglePlacesWebService,
  GooglePlacesNativeService, GooglePlacesManagerState}