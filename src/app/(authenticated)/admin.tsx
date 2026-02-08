import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AdminPostCard } from '@/components/admin/admin-post-card';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useDeletePost, usePosts } from '@/hooks/posts/use-posts';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AdminScreen() {
  const router = useRouter();
  const auth = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const postsQuery = usePosts();
  const deleteMutation = useDeletePost();

  useEffect(() => {
    if (!auth.isLoading && !auth.isProfessor) {
      router.replace('/(authenticated)/home');
    }
  }, [auth.isProfessor, auth.isLoading, router]);

  const handleEdit = (id: string) => {
    router.push({ pathname: '/(authenticated)/post/edit-post/[id]', params: { id } });
  };

  const handleDeleteClick = (id: string, titulo: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir o post "${titulo}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(id),
        },
      ]
    );
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

  if (postsQuery.isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (postsQuery.isError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Erro ao carregar posts. Tente novamente.</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => postsQuery.refetch()}
          style={[styles.retryButton, { backgroundColor: colors.tint }]}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const posts = postsQuery.data ?? [];

  if (posts.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.icon }]}>Nenhum post disponível ainda.</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/(authenticated)/post/create-post')}
          style={[styles.newPostButton, { backgroundColor: colors.tint }]}
        >
          <Text style={styles.newPostButtonText}>Criar Primeiro Post</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AdminPostCard
            post={item}
            onEdit={() => handleEdit(item._id)}
            onDelete={() => handleDeleteClick(item._id, item.titulo)}
          />
        )}
        contentContainerStyle={styles.listContent}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  newPostButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newPostButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
});
