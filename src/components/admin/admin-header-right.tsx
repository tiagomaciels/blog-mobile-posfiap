import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function AdminHeaderRight() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleNewPost = () => {
    router.push('/(authenticated)/post/create-post');
  };

  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleNewPost}>
      <Text style={[styles.buttonText, { color: colors.tint }]}>Novo post</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
  },
  buttonText: {
    fontSize: 16,
  },
});
