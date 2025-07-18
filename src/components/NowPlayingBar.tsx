/* import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Cambiado de native-stack a stack
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Hymn } from '../navigation/types';
import { AudioService } from '../services/AudioService'; // Ruta correcta según tu actualización

// Definir el tipo de las rutas de navegación
export type RootStackParamList = {
  HomeScreen: undefined;
  PlayerScreen: undefined; // Ajusta si PlayerScreen recibe parámetros
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const NowPlayingBar = () => {
  const navigation = useNavigation<NavigationProp>();
  const state = AudioService.getCurrentState();
  const currentHymn: Hymn | undefined = state?.currentSong;

  if (!currentHymn) {
    return null; // No mostrar la barra si no hay canción reproduciéndose
  }

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
      }}
      onPress={() => navigation.navigate('PlayerScreen')} // Nombre exacto de la pantalla
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          {currentHymn.title}
        </Text>
        <Text style={{ fontSize: 14, color: '#666' }}>
          {currentHymn.category === 'himnos' ? 'Himnario' : 'Coros'}
        </Text>
      </View>
      <Text>{state.isPlaying ? '▶' : '⏸'}</Text>
    </TouchableOpacity>
  );
}; */