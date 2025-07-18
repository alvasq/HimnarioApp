import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type Song = {
  id: string;
  title: string;
  category: 'himnos' | 'coros';
  downloaded?: boolean;
};

export type RootStackParamList = {
  Home: { currentSong?: Song };
  Player: {
    song: Song;
    songList: Song[];
    autoplay?: boolean;
    currentSong?: Song;
  };
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type PlayerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Player'
>;

export type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;
