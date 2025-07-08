# google-places-core

A lightweight, framework-agnostic JavaScript/TypeScript library for interacting with the Google Places API (Autocomplete and Place Details). Supports both web browsers and React Native environments.

## Installation
```
npm install google-places-core
# or
yarn add google-places-core
```

## Usage
You need a Google Maps API Key with the *"Places API"* enabled.

#### Web setup
```
// googlePlacesSetup.ts
import { createGooglePlacesManager } from 'google-places-core';

const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";
export const googlePlacesManager = createGooglePlacesManager(GOOGLE_MAPS_API_KEY, 'web');
```

#### React Native Setup
```
// googlePlacesSetup.ts
import { createGooglePlacesManager } from 'google-places-core';

const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";
export const googlePlacesManager = createGooglePlacesManager(GOOGLE_MAPS_API_KEY, 'native');
```


### Frame integration
#### React hook (Web & Native)
```
import { useEffect, useState, useCallback } from 'react';
import { googlePlacesManager } from '../googlePlacesSetup';

const useGooglePlaces = () => {
  const [state, setState] = useState(googlePlacesManager.getState());

  useEffect(() => {
    const unsubscribe = googlePlacesManager.subscribe(setState);
    return () => {
      unsubscribe();
      // Call destroy() if component unmounts
      googlePlacesManager.destroy();
    };
  }, []);

  const updateSearchInput = useCallback((input: string) => {
    googlePlacesManager.updateSearchInput(input);
  }, []);

  const getPlaceDetails = useCallback(async (placeId: string) => {
    return googlePlacesManager.getPlaceDetails(placeId);
  }, []);

  return { ...state, updateSearchInput, getPlaceDetails };
};

...//
const { predictions, isLoading, error, updateSearchInput, getPlaceDetails } = useGooglePlaces();
```

#### Vue composable (Web only)
```
import { ref, onMounted, onUnmounted } from 'vue';
import { googlePlacesManager } from '../googlePlacesSetup';

export function useGooglePlaces() {
  const state = ref(googlePlacesManager.getState());

  const updateState = (newState) => {
    state.value = newState;
  };

  onMounted(() => {
    const unsubscribe = googlePlacesManager.subscribe(updateState);
    onUnmounted(() => {
      unsubscribe();
      googlePlacesManager.destroy();
    });
  });

  return {
    state,
    updateSearchInput: googlePlacesManager.updateSearchInput,
    getPlaceDetails: googlePlacesManager.getPlaceDetails
  };
}
```

## API Reference
- `createGooglePlacesManager(apiKey: string, platform?: 'web' | 'native')` ::-> Creates a manager instance for the specified platform.
- `GoogleMapService`: Class for direct Google Places API calls (`fetchPredictions(input: string): Promise<GooglePlacePredictionT[]>`, `fetchPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT>`).

- `GooglePlacesManager`: Class that manages search state, debouncing, and provides methods:
  - `updateSearchInput(input: string): void`
  - `getPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT>`
  - `subscribe(callback: (state: GooglePlacesManagerState) => void): () => void` (Returns an unsubscribe function)
  - `getState(): GooglePlacesManagerState` (Returns the current state object)
  - `destroy(): void`

- Types: `GooglePlacePredictionT`, `GooglePlaceDetailsT`, `GooglePlacesManagerState`.


### Platform-Specific Notes
#### Web
- Automatically loads Google Maps JavaScript API
- Uses Places Autocomplete service
- Requires browser environment

#### React Native
- Uses direct HTTP requests to Places API
- No external script dependencies
- Works in mobile environments

### Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

### License
This project is licensed under the [MIT License](https://github.com/sadewole/google-places-core/blob/main/LICENSE).