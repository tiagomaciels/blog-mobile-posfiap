import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <TouchableOpacity style={{ marginHorizontal: 8 }} activeOpacity={0.7} onPress={handleLogout}>
      <Text style={{ color: colors.logout, fontSize: 16 }}>Sair</Text>
    </TouchableOpacity>
  );
}
