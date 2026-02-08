import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function HomeHeaderTitle() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme ?? 'light'];
  const roleLabel = user?.role === 'professor' ? 'Professor' : 'Aluno';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name="home-outline" size={24} color={colors.text} />
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{roleLabel}</Text>
    </View>
  );
}
