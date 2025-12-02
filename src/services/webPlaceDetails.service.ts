import { GooglePlaceDetailsT } from '../types';
import { Helpers } from '../utils/helpers';
import { PlaceDetailsStrategy } from './placeDetailsStrategy';

export class WebPlaceDetails extends Helpers implements PlaceDetailsStrategy {
  private isBrowser: boolean;
  private initializationPromise: Promise<void> | null = null;
  private placesLibrary: any = null;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('GooglePlacesWebService: API Key must be provided.');
    }

    super(apiKey);
    this.isBrowser = this.checkBrowserEnvironment();
  }

  public async fetchPlaceDetails(
    placeId: string
  ): Promise<GooglePlaceDetailsT> {
    await this.ensureInitialized();
    return await this.getPlaceDetails(placeId);
  }

  // Initialization
  private async ensureInitialized(): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('GooglePlacesWebService: Browser environment required');
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initialize();
    return this.initializationPromise;
  }

  private async initialize(): Promise<void> {
    await this.injectScript();
    await this.waitForLoad();
    await this.loadPlacesLibrary();
  }

  private async loadPlacesLibrary(): Promise<void> {
    if (!this.isLoaded()) {
      throw new Error('Google Maps API not available');
    }

    this.placesLibrary = await window.google!.maps.importLibrary('places');
  }

  // Place Details using new JavaScript SDK
  private async getPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT> {
    if (!this.placesLibrary) {
      throw new Error('Places library not initialized');
    }

    const { Place } = this.placesLibrary;

    const place = new Place({
      id: placeId,
      requestedLanguage: 'en',
    });

    // Fetch required fields
    await place.fetchFields({
      fields: [
        'displayName',
        'formattedAddress',
        'location',
        'viewport',
        'addressComponents',
        'types',
      ],
    });

    return this.transformPlaceDetails(place);
  }

  // Transformation methods
  private transformPlaceDetails(place: any): GooglePlaceDetailsT {
    const viewport = JSON.stringify(place.viewport)
    return {
      formatted_address: place.formattedAddress || '',
      geometry: {
        location: {
          lat: place.location?.lat() || 0,
          lng: place.location?.lng() || 0,
        },
        viewport: JSON.parse(viewport),
      },
      name: place.displayName?.text || '',
      place_id: place.id || '',
      address_components:
        place.addressComponents?.map((component: any) => ({
          long_name: component.longText,
          short_name: component.shortText,
          types: component.types,
        })) || [],
      types: place.types || [],
    };
  }
}
