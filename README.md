# google-places-core

A lightweight, platform-agnostic JavaScript/TypeScript library for interacting with the Google Places API (Autocomplete and Place Details). Works flawlessly across **Web browsers** and **React Native** environments with automatic platform detection and optimized implementations.

[![npm version](https://img.shields.io/npm/v/google-places-core.svg)](https://www.npmjs.com/package/google-places-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)


## ✨ Features

- **🌍 Cross-Platform** - Single API for web and native (React Native) environments
- **🤖 Auto Platform Detection** - Automatically uses optimal implementation for your environment
- **📦 Zero Configuration** - Just add your API key and start fetching places
- **⚡ Intelligent Debounce** - Built-in debounce for better performance
- **🎯 TypeScript First** - Full type safety with comprehensive TypeScript definitions
- **🔄 Framework Agnostic** - Works with React, Vue, Angular, Svelte, or plain JavaScript
- **🔒 Secure** - No API key exposure in client-side bundles
- **📱 React Native Ready** - No additional setup required

## Installation
```
npm install google-places-core
# or
yarn add google-places-core
```

## Usage
You need a Google Maps API Key with the *"Places API"* enabled.

#### setup
```
// googlePlacesSetup.ts
import { createGooglePlacesManager } from 'google-places-core';

const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";
export const googlePlacesManager = createGooglePlacesManager(GOOGLE_MAPS_API_KEY);

-- or --

const googlePlacesManager = createGooglePlacesService(YOUR_GOOGLE_MAPS_API_KEY, {
  countryRestrictions: ['US'], // Optional: restrict to specific countries
  languageCode: 'en', // Optional: default is 'en'
});
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

#### 🔧 Advanced Configuration

```
import { createGooglePlacesManager } from 'google-places-core';

const placesManager = createGooglePlacesManager(YOUR_API_KEY, {  
  debounceTime: 3000, // debounce timer
  countryRestrictions: ['US', 'CA'], // Restrict to specific countries
  languageCode: 'es', // Spanish results
  
  // Location bias for more relevant results
  locationBias: {
    center: { latitude: 40.7128, longitude: -74.0060 }, // New York
    radius: 50000, // 50km radius
  },
  
  // Logging
  enableLogging: process.env.NODE_ENV === 'development',
});
```

## API Reference
- `createGooglePlacesManager(apiKey: string, options?: { debounceTime?: number, countryRestrictions?: string[] })` ::-> Creates a manager instance for the specified platform.
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

### 🛣️ Migration from <=v1.1.0
```
import { createGooglePlacesManager } from 'google-places-core';

// Old way (deprecated)
const service = createGooglePlacesManager(YOUR_KEY, *platform*, { country: ['NG'] });

// New way
const service = createGooglePlacesManager(YOUR_KEY, { countryRestrictions: [NG] });
```

### Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

### License
This project is licensed under the [MIT License](https://github.com/sadewole/google-places-core/blob/main/LICENSE).