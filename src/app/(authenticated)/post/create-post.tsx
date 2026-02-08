import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PostForm } from '@/components/post/post-form';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useCreatePost } from '@/hooks/posts/use-posts';
import { useColorScheme } from '@/hooks/use-color-scheme';

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return 'Erro ao criar post';
}

export default function CreatePostScreen() {
  const router = useRouter();
  const auth = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const createMutation = useCreatePost();

  useEffect(() => {
    if (!auth.isLoading && !auth.isProfessor) {
      router.replace('/(authenticated)/home');
    }
  }, [auth.isProfessor, auth.isLoading, router]);

  const handleSubmit = async (values: { titulo: string; conteudo: string; autor: string }) => {
    await createMutation.mutateAsync(values);
  };

  if (auth.isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!auth.isProfessor) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {createMutation.isError && <Text style={styles.error}>{getErrorMessage(createMutation.error)}</Text>}
      <PostForm
        defaultValues={{
          titulo: '',
          conteudo: '',
          autor: auth.user?.nome ?? '',
        }}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Enviar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
});
