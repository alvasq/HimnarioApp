import TrackPlayer from 'react-native-track-player';

export const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    stopWithApp: false,
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
    ],
    notificationCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
    ],
  });
};
