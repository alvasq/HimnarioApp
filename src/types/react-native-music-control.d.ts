declare module 'react-native-music-control' {
  // Métodos principales
  export function enableBackgroundMode(enable: boolean): void;
  export function enableControl(control: string, enable: boolean): void;
  export function setNowPlaying(metadata: {
    title: string;
    artist?: string;
    duration?: number;
    artwork?: string;
  }): void;
  export function updatePlayback(options: {
    state: number;
    elapsedTime: number;
  }): void;
  export function resetNowPlaying(): void;
  export function stopControl(): void;
  export function removeAllListeners(): void;

  // Eventos
  export function on(event: string, callback: () => void): void;

  // Estados
  export const STATE_PLAYING: number;
  export const STATE_PAUSED: number;
  export const STATE_STOPPED: number;
  export const STATE_BUFFERING: number;

  // Controles
  export const COMMAND_PLAY: string;
  export const COMMAND_PAUSE: string;
  export const COMMAND_NEXT_TRACK: string;
  export const COMMAND_PREVIOUS_TRACK: string;
  export const COMMAND_STOP: string;
}
