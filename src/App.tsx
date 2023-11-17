/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Text,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = useMemo(
    () => (isDarkMode ? MD3DarkTheme : MD3LightTheme),
    [isDarkMode],
  );

  const navigationTheme = useMemo(
    () => (isDarkMode ? DarkTheme : DefaultTheme),
    [isDarkMode],
  );

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={navigationTheme}>
          <Text>Hello, World!</Text>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
