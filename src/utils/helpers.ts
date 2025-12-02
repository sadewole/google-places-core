export class Helpers {
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  checkBrowserEnvironment(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  isLoaded(): boolean {
    return typeof window !== 'undefined' && 
           typeof window.google !== 'undefined' && 
           typeof window.google?.maps?.importLibrary === 'function';
  }

  isScriptInjected(): boolean {
    return Array.from(document.scripts).some((s) =>
      s.src.includes('maps.googleapis.com/maps/api/js')
    );
  }

  injectScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Failed to load Google Maps API'));
      document.head.appendChild(script);
    });
  }

  waitForLoad(): Promise<void> {
    return new Promise((resolve) => {
      const check = () =>
        this.isLoaded() ? resolve() : setTimeout(check, 100);
      setTimeout(() => resolve(), 10000); // Timeout after 10s
      check();
    });
  }
}
