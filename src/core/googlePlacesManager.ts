import { GooglePlacesService } from './googlePlacesService';
import { GooglePlaceDetailsT, GooglePlacePredictionT } from '../types';
import { debounce } from '../utils/debounce';

interface GooglePlacesManagerState {
  predictions: GooglePlacePredictionT[];
  isLoading: boolean;
  error: Error | null;
}

class GooglePlacesManager {
  private state: GooglePlacesManagerState = {
    predictions: [],
    isLoading: false,
    error: null,
  };
  private subscribers: Set<(state: GooglePlacesManagerState) => void> = new Set();
  private placesService: GooglePlacesService;
  private debouncedGetPredictions: ((input: string) => void) & { cancel: () => void };

  constructor(service: GooglePlacesService, debounceTime: number = 300) {
    this.placesService = service;
    this.debouncedGetPredictions = debounce(this.fetchPredictionsInternal, debounceTime);
  }

  private setState(newState: Partial<GooglePlacesManagerState>) {
    this.state = { ...this.state, ...newState };
    this.subscribers.forEach(callback => callback(this.state));
  }

  private fetchPredictionsInternal = async (input: string) => {
    if (!input) {
      this.setState({ predictions: [], isLoading: false, error: null });
      return;
    }

    this.setState({ isLoading: true, error: null });
    try {
      const predictions = await this.placesService.fetchPredictions(input);
      this.setState({ predictions, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching predictions:', error);
      this.setState({ predictions: [], isLoading: false, error });
    }
  };

  public updateSearchInput(input: string) {
    this.debouncedGetPredictions(input);
  }

  public async getPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT> {
    try {
      return await this.placesService.fetchPlaceDetails(placeId);
    } catch (error: any) {
      console.error('Error fetching place details:', error);
      this.setState({ error });
      throw error;
    }
  }

  public subscribe(callback: (state: GooglePlacesManagerState) => void): () => void {
    this.subscribers.add(callback);
    callback(this.state);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public getState(): GooglePlacesManagerState {
    return { ...this.state };
  }

  public destroy() {
      this.debouncedGetPredictions.cancel();
      this.subscribers.clear();
  }
}

export { GooglePlacesManager, GooglePlacesManagerState };