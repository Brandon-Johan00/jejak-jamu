import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from '../context/AppDataContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="recipe/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ingredient/[id]"
            options={{ headerShown: false }}
          />
        </Stack>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
