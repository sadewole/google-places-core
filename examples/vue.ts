// import { ref, onUnmounted } from 'vue';
// import { GooglePlacesManager } from 'google-places-core';

// export const useGooglePlaces = (apiKey: string) => {
//   const manager = createGooglePlacesManager(apiKey, 'web', { country: ['ng'] });
//   const state = ref(manager.getState());

//   const unsubscribe = manager.subscribe((newState) => {
//     state.value = newState;
//   });

//   onUnmounted(() => {
//     unsubscribe();
//     manager.destroy();
//   });

//   return {
//     ...state,
//     updateSearchInput: manager.updateSearchInput.bind(manager),
//     getPlaceDetails: manager.getPlaceDetails.bind(manager),
//   };
// };

// const { predictions, isLoading, error, updateSearchInput, getPlaceDetails } = useGooglePlaces();