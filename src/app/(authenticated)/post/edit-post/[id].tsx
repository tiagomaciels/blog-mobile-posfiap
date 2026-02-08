import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PostForm } from '@/components/post/post-form';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { usePost } from '@/hooks/posts/use-post';
import { useUpdatePost } from '@/hooks/posts/use-posts';
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
  return 'Erro ao salvar post';
}

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const auth = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { data: post, isLoading: isPostLoading, isError } = usePost(id ?? '');
  const updateMutation = useUpdatePost(id ?? '');

  useEffect(() => {
    if (!auth.isLoading && !auth.isProfessor) {
      router.replace('/(authenticated)/home');
    }
  }, [auth.isProfessor, auth.isLoading, router]);

  const handleSubmit = async (values: { titulo: string; conteudo: string; autor: string }) => {
    await updateMutation.mutateAsync(values);
  };

  if (auth.isLoading || isPostLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!auth.isProfessor) {
    return null;
  }

  if (isError || !post) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Post não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {updateMutation.isError && <Text style={styles.error}>{getErrorMessage(updateMutation.error)}</Text>}
      <PostForm
        defaultValues={{
          titulo: post.titulo,
          conteudo: post.conteudo,
          autor: post.autor,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Salvar"
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
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
});
