import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LogoutButton } from '@/components/home/logout-button';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function HomeHeaderRight() {
  const router = useRouter();
  const auth = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleNewPost = () => {
    router.push('/(authenticated)/post/create-post');
  };

  const handleAdmin = () => {
    router.push('/(authenticated)/admin');
  };

  return (
    <View style={styles.container}>
      {auth.isProfessor && (
        <>
          <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleNewPost}>
            <Text style={[styles.buttonText, { color: colors.tint }]}>Novo post</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleAdmin}>
            <Text style={[styles.buttonText, { color: colors.tint }]}>Admin</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </>
      )}
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.light.icon,
    // marginHorizontal: 8,
  },
});
