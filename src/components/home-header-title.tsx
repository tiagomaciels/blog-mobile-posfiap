import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text } from 'react-native';

export function HomeHeaderTitle() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme ?? 'light'];
  const roleLabel = user?.role === 'professor' ? 'Professor' : 'Aluno';
  return <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>Home - {roleLabel}</Text>;
}
