import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { PostCard } from '@/components/post-card';
import { Colors } from '@/constants/theme';
import { usePosts, useSearchPosts } from '@/hooks/posts/use-posts';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchKeyword, setSearchKeyword] = useState('');

  const postsQuery = usePosts();
  const searchQuery = useSearchPosts(searchKeyword);

  const hasSearchTerm = searchKeyword.trim().length > 0;
  const { data: posts, isLoading, isError, refetch } = hasSearchTerm ? searchQuery : postsQuery;

  const handlePostPress = (id: string) => {
    router.push({ pathname: '/(authenticated)/post/[id]', params: { id } });
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Erro ao carregar posts. Tente novamente.</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => refetch()}
          style={[styles.retryButton, { backgroundColor: colors.tint }]}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { borderColor: colors.icon }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text, borderColor: colors.icon }]}
          placeholder="Buscar posts..."
          placeholderTextColor={colors.icon}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
      </View>
      {!posts || posts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: colors.icon }]}>Nenhum post encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PostCard post={item} onPress={() => handlePostPress(item._id)} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 24,
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
  },
});
