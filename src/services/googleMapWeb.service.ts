import { GooglePlacesService } from "../core/googlePlacesService";
import { GooglePlaceDetailsT, GooglePlacePredictionT } from "../types";
import { Helpers } from "../utils/helpers";

class GooglePlacesWebService extends Helpers implements GooglePlacesService {
  private autocompleteService: any;
  private placesService: any;
  private readonly isBrowser: boolean;
  private loadPromise: Promise<void> | null = null;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('GoogleMapService: API Key must be provided.');

    super(apiKey)
    this.isBrowser = this.checkBrowserEnvironment();
  }

  // Public API Methods
  public async fetchPredictions(
    input: string
  ): Promise<GooglePlacePredictionT[]> {
    await this.ensureReady();
    return this.getPredictions(input);
  }

  public async fetchPlaceDetails(
    placeId: string
  ): Promise<GooglePlaceDetailsT> {
    await this.ensureReady();
    return this.getPlaceDetails(placeId);
  }

  // Core Implementation
  private async ensureReady(): Promise<void> {
    if (!this.isBrowser) throw new Error('Browser environment required');
    if (this.isLoaded()) return;
    if (!this.loadPromise) this.loadPromise = this.loadGoogleMaps();
    await this.loadPromise;
  }

  private async loadGoogleMaps(): Promise<void> {
    if (!this.isScriptInjected()) await this.injectScript();
    await this.waitForLoad();
    this.initServices();
  }

  private getPredictions(input: string): Promise<GooglePlacePredictionT[]> {
    return new Promise((resolve, reject) => {
      this.autocompleteService.getPlacePredictions(
        { input },
        (predictions: GooglePlacePredictionT[], status: string) => {
          status === window.google!.maps.places.PlacesServiceStatus.OK
            ? resolve(this.transformPredictions(predictions || []))
            : reject(new Error(`Places API error: ${status}`));
        }
      );
    });
  }

  private getPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT> {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        { placeId, fields: ['geometry', 'formatted_address'] },
        (place: GooglePlaceDetailsT, status: string) => {
          status === window.google!.maps.places.PlacesServiceStatus.OK
            ? resolve(this.transformPlaceDetails(place))
            : reject(new Error(`Places details error: ${status}`));
        }
      );
    });
  }

  private initServices(): void {
    this.autocompleteService =
      new window.google!.maps.places.AutocompleteService();
    this.placesService = new window.google!.maps.places.PlacesService(
      document.createElement('div')
    );
  }

  private transformPredictions(predictions: any[]): GooglePlacePredictionT[] {
    return predictions.map(p => ({
      description: p.description,
      place_id: p.place_id,
      structured_formatting: {
        main_text: p.structured_formatting.main_text,
        secondary_text: p.structured_formatting.secondary_text,
      },
      types: p.types || [],
    }));
  }

  private transformPlaceDetails(place: any): GooglePlaceDetailsT {
    return {
      formatted_address: place.formatted_address,
      geometry: {
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
        viewport: place.geometry.viewport ? {
          south: place.geometry.viewport.getSouthWest().lat(),
          west: place.geometry.viewport.getSouthWest().lng(),
          north: place.geometry.viewport.getNorthEast().lat(),
          east: place.geometry.viewport.getNorthEast().lng(),
        } : undefined,
      },
      name: place.name,
      place_id: place.place_id,
    };
  }
}

export {GooglePlacesWebService}