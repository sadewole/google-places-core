// import { useEffect, useState } from 'react';
// import { GooglePlacesManager } from 'google-places-core';

// export const useGooglePlaces = (apiKey: string) => {
//   const [manager] = useState(() => createGooglePlacesManager(apiKey));
//   const [state, setState] = useState(manager.getState());

//   useEffect(() => {
//     const unsubscribe = manager.subscribe(setState);
//     return () => {
//       unsubscribe();
//       manager.destroy();
//     };
//   }, [manager]);

//   return {
//     ...state,
//     updateSearchInput: manager.updateSearchInput.bind(manager),
//     getPlaceDetails: manager.getPlaceDetails.bind(manager),
//   };
// };

// const { predictions, isLoading, error, updateSearchInput, getPlaceDetails } = useGooglePlaces();