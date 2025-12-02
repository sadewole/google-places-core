export class PlatformDetector {
  static detect(): 'web' | 'native' {
    // Check for browser environment
    const hasWindow = typeof window !== 'undefined';
    const hasDocument = typeof document !== 'undefined';
    const hasNavigator = typeof navigator !== 'undefined';

    return hasWindow && hasDocument && hasNavigator ? 'web' : 'native';
  }

  static isWeb(): boolean {
    return this.detect() === 'web';
  }

  static isNative(): boolean {
    return this.detect() === 'native';
  }
}
