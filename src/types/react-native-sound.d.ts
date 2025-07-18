declare module 'react-native-sound' {
  class Sound {
    constructor(
      path: string,
      basePath?: string,
      callback?: (error: any) => void,
    );

    play: (callback?: (success: boolean) => void) => void;
    pause: (callback?: () => void) => void;
    stop: (callback?: () => void) => void;
    release: () => void;
    getDuration: () => number;
    getCurrentTime: (callback: (seconds: number) => void) => void;
    setVolume: (value: number) => void;
    isPlaying: () => boolean;
    static setCategory: (value: string, mixWithOthers?: boolean) => void;
  }

  namespace Sound {
    const MAIN_BUNDLE: string;
    const DOCUMENT: string;
    const LIBRARY: string;
    const CACHES: string;
  }

  export = Sound;
}
