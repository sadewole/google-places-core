# google-places-core

A lightweight, framework-agnostic JavaScript/TypeScript library for interacting with the Google Places API (Autocomplete and Place Details). It provides core logic and state management, letting you build your UI in any framework.

## Installation
```
npm install google-places-core
# or
yarn add google-places-core
```

## Usage
You need a Google Maps API Key with the *"Places API"* enabled. Provide this key when initializing GooglePlacesManager.

```
// <root-example>/googlePlacesSetup.ts

import { GooglePlacesManager } from 'google-places-core';

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
export const googlePlacesManager = new GooglePlacesManager(GOOGLE_MAPS_API_KEY);
```

#### React Integration
Create a custom hook to integrate with React's state and lifecycle.
```
import { useEffect, useState, useCallback } from 'react';
import { googlePlacesManager } from '../googlePlacesSetup'; // Your manager instance
import { GooglePlacePredictionT, GooglePlaceDetailsT } from 'google-places-core';

const useGooglePlaces = () => {
  const [state, setState] = useState(googlePlacesManager.getState());

  useEffect(() => {
    const unsubscribe = googlePlacesManager.subscribe(setState);
    return () => unsubscribe();
  }, []);

  const updateSearchInput = useCallback((input: string) => {
    googlePlacesManager.updateSearchInput(input);
  }, []);

  const getPlaceDetails = useCallback(async (placeId: string) => {
    return googlePlacesManager.getPlaceDetails(placeId);
  }, []);

  return { ...state, updateSearchInput, getPlaceDetails };
};

export default useGooglePlaces;

...//
const { predictions, isLoading, error, updateSearchInput, getPlaceDetails } = useGooglePlaces();
```

#### Vue Integration
Create a composable function to integrate with Vue's reactivity system.
```
import { ref, onMounted, onUnmounted } from 'vue';
import { googlePlacesManager } from '../googlePlacesSetup'; // Your manager instance
import { GooglePlacePredictionT, GooglePlaceDetailsT } from 'google-places-core';

export function useGooglePlaces() {
  const predictions = ref<GooglePlacePredictionT[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const updateState = (newState: any) => {
    predictions.value = newState.predictions;
    isLoading.value = newState.isLoading;
    error.value = newState.error;
  };

  let unsubscribe: (() => void) | undefined;

  onMounted(() => {
    updateState(googlePlacesManager.getState()); // Initial sync
    unsubscribe = googlePlacesManager.subscribe(updateState);
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  const updateSearchInput = (input: string) => {
    googlePlacesManager.updateSearchInput(input);
  };

  const getPlaceDetails = async (placeId: string): Promise<GooglePlaceDetailsT> => {
    return googlePlacesManager.getPlaceDetails(placeId);
  };

  return { predictions, isLoading, error, updateSearchInput, getPlaceDetails };
}
```

## API Reference
- `GoogleMapService`: Class for direct Google Places API calls (`fetchPredictions(input: string): Promise<GooglePlacePredictionT[]>`, `fetchPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT>`).

- `GooglePlacesManager`: Class that manages search state, debouncing, and provides methods:
  - `updateSearchInput(input: string): void`
  - `getPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT>`
  - `subscribe(callback: (state: GooglePlacesManagerState) => void): () => void` (Returns an unsubscribe function)
  - `getState(): GooglePlacesManagerState` (Returns the current state object)
  - destroy(): void

- Types: `GooglePlacePredictionT`, `GooglePlaceDetailsT`, `GooglePlacesManagerState`.

### Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

### License
This project is licensed under the [MIT License](https://github.com/sadewole/google-places-core/blob/main/LICENSE).