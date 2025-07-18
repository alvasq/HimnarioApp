import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AudioPlayerProvider } from '../components/AudioPlayerProvider';
import { RootStackParamList } from '../navigation/types';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AudioPlayerProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffff',
            },
            headerTintColor: '#00000',
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Himnario',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{
              title: 'Reproduciendo',
              headerBackTitle: 'Atrás',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioPlayerProvider>
  );
};

export default App;