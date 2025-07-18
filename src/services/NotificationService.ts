/* import MusicControl from 'react-native-music-control';
import { Hymn } from '../types/hymnTypes';
import { playHymn, togglePlayPause } from './AudioService';

// Estado global
let hymnList: Hymn[] = [];
let currentIndex = 0;
let isNotificationSetup = false;

export const initNotifications = (
  songs: Hymn[],
  initialIndex: number,
): void => {
  if (isNotificationSetup) cleanupNotifications();

  hymnList = songs;
  currentIndex = initialIndex;

  // Configuración inicial
  MusicControl.enableBackgroundMode(true);

  // Habilitar controles (usando constantes)
  MusicControl.enableControl(MusicControl.COMMAND_PLAY, true);
  MusicControl.enableControl(MusicControl.COMMAND_PAUSE, true);
  MusicControl.enableControl(MusicControl.COMMAND_NEXT_TRACK, true);
  MusicControl.enableControl(MusicControl.COMMAND_PREVIOUS_TRACK, true);
  MusicControl.enableControl(MusicControl.COMMAND_STOP, true);

  // Eventos (usando constantes)
  MusicControl.on(MusicControl.COMMAND_PLAY, () => {
    togglePlayPause();
    updateNotificationState(true);
  });

  MusicControl.on(MusicControl.COMMAND_PAUSE, () => {
    togglePlayPause();
    updateNotificationState(false);
  });

  MusicControl.on(MusicControl.COMMAND_NEXT_TRACK, () => {
    const nextIndex = (currentIndex + 1) % hymnList.length;
    playHymn(hymnList[nextIndex]);
    currentIndex = nextIndex;
  });

  MusicControl.on(MusicControl.COMMAND_PREVIOUS_TRACK, () => {
    const prevIndex = (currentIndex - 1 + hymnList.length) % hymnList.length;
    playHymn(hymnList[prevIndex]);
    currentIndex = prevIndex;
  });

  MusicControl.on(MusicControl.COMMAND_STOP, cleanupNotifications);

  isNotificationSetup = true;
};

const updateNotificationState = (isPlaying: boolean): void => {
  MusicControl.updatePlayback({
    state: isPlaying ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED,
    elapsedTime: 0,
  });
};

export const updateNotificationMetadata = (hymn: Hymn): void => {
  MusicControl.setNowPlaying({
    title: hymn.title,
    artwork: hymn.artwork || 'ic_notification', // Usa el artwork si existe, sino el default
  });
};

export const cleanupNotifications = (): void => {
  if (!isNotificationSetup) return;

  MusicControl.resetNowPlaying();
  MusicControl.stopControl();
  MusicControl.removeAllListeners();

  hymnList = [];
  currentIndex = 0;
  isNotificationSetup = false;
};

const convertToSeconds = (timeStr: string): number => {
  const [mins, secs] = timeStr.split(':').map(Number);
  return mins * 60 + (secs || 0);
};
 */
