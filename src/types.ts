export interface GooglePlacePredictionT {
    place_id: string;
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
    types: string[];
  }
  
  export interface GooglePlaceDetailsT {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      viewport?: {
        south: number;
        west: number;
        north: number;
        east: number;
      };
    };
    formatted_address: string;
    name?: string;
    place_id: string;
  }

  declare global {
    interface Window {
      google?: GoogleMaps;
    }
  }

  interface GoogleMaps {
      maps: {
        places: {
          AutocompleteSuggestion: new () => any;
          Place: new (div: HTMLDivElement) => any;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            ERROR: string;
            [key: string]: string;
          };
        };
      };
    };
  
  