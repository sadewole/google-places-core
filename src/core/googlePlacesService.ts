import { GooglePlaceDetailsT, GooglePlacePredictionT } from "../types";

interface GooglePlacesService {
  fetchPredictions(input: string): Promise<GooglePlacePredictionT[]>;
  fetchPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT>;
}

export { GooglePlacesService };