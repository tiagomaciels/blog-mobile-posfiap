import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <Pressable onPress={handleLogout} style={{ marginRight: 16 }}>
      <Text style={{ color: colors.tint, fontSize: 16 }}>Sair</Text>
    </Pressable>
  );
}

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
          title: 'Home',
          headerRight: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
}
