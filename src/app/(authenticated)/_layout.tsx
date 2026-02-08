import { Stack } from 'expo-router';

import { HomeHeaderTitle } from '@/components/home-header-title';
import { LogoutButton } from '@/components/logout-button';

export default function AuthenticatedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: 'default',
        headerBackButtonMenuEnabled: true,
        headerBackTitle: 'Voltar',
      }}
      initialRouteName="home"
    >
      <Stack.Screen
        name="home"
        options={{
          headerTitle: () => <HomeHeaderTitle />,
          headerRight: () => <LogoutButton />,
        }}
      />
      <Stack.Screen
        name="post/[id]"
        options={{
          title: 'Post',
        }}
      />
    </Stack>
  );
}
