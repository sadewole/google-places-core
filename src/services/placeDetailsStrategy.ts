import { GooglePlaceDetailsT } from '../types';
import { WebPlaceDetails } from './webPlaceDetails.service';
import { NativePlaceDetails } from './nativePlaceDetails.service';
import { PlatformDetector } from '../utils/platform';

export interface PlaceDetailsStrategy {
  fetchPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT>;
}

export class PlaceDetailsStrategyFactory {
  static createStrategy(
    platform: 'web' | 'native',
    apiKey: string,
    config?: StrategyConfig
  ): PlaceDetailsStrategy {
    switch (platform) {
      case 'web':
        return new WebPlaceDetails(apiKey);
      case 'native':
        return new NativePlaceDetails(apiKey, config);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  static createStrategyForEnvironment(
    apiKey: string,
    config?: StrategyConfig
  ): PlaceDetailsStrategy {
    const platform = PlatformDetector.detect();
    return this.createStrategy(platform, apiKey, config);
  }
}

export interface StrategyConfig {
  countryRestrictions?: string[];
  locationBias?: {
    center: { latitude: number; longitude: number };
    radius: number;
  };
  languageCode?: string;
}
