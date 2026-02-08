import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { PostCard } from '@/components/post/post-card';
import { Colors } from '@/constants/theme';
import { usePosts, useSearchPosts } from '@/hooks/posts/use-posts';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDebounce } from '@/hooks/use-debounce';

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchKeyword, setSearchKeyword] = useState('');

  const debouncedKeyword = useDebounce(searchKeyword, 400);

  const postsQuery = usePosts();
  const searchQuery = useSearchPosts(debouncedKeyword);

  const hasSearchTerm = debouncedKeyword.trim().length > 0;

  const isInitialLoading = !hasSearchTerm && postsQuery.isLoading;
  const isSearching = hasSearchTerm && searchQuery.isFetching;

  const displayPosts = hasSearchTerm ? (searchQuery.data ?? postsQuery.data) : postsQuery.data;
  const displayError = hasSearchTerm ? searchQuery.isError : postsQuery.isError;
  const displayRefetch = () => (hasSearchTerm ? searchQuery.refetch() : postsQuery.refetch());

  const handlePostPress = (id: string) => {
    router.push({ pathname: '/(authenticated)/post/[id]', params: { id } });
  };

  if (isInitialLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (displayError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Erro ao carregar posts. Tente novamente.</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => displayRefetch()}
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
        <View style={styles.searchRow}>
          <TextInput
            style={[styles.searchInput, { color: colors.text, borderColor: colors.icon }]}
            placeholder="Buscar posts..."
            placeholderTextColor={colors.icon}
            value={searchKeyword}
            onChangeText={setSearchKeyword}
          />
          {isSearching && <ActivityIndicator size="small" color={colors.tint} style={styles.searchIndicator} />}
          {searchKeyword.length > 0 && !isSearching && (
            <Pressable onPress={() => setSearchKeyword('')} style={styles.clearButton} hitSlop={8}>
              <Ionicons name="close-circle" size={24} color={colors.icon} />
            </Pressable>
          )}
        </View>
      </View>
      {!displayPosts || displayPosts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: colors.icon }]}>Nenhum post encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={displayPosts}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchIndicator: {
    marginLeft: 4,
  },
  clearButton: {
    padding: 4,
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
