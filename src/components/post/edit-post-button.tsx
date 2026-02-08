import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface EditPostButtonProps {
  postId: string;
}

export function EditPostButton({ postId }: EditPostButtonProps) {
  const router = useRouter();
  const auth = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleEdit = () => {
    router.push({ pathname: '/(authenticated)/post/edit-post/[id]', params: { id: postId } });
  };

  if (!auth.isProfessor) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleEdit}>
      <Text style={[styles.buttonText, { color: colors.tint }]}>Editar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
  },
});
