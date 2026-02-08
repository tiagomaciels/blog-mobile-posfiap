import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Post } from '@/types/post';
import { truncateDescription } from '@/utils/truncate-desc';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const description = truncateDescription(post.conteudo);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.icon,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {post.titulo}
      </Text>
      <Text style={[styles.author, { color: colors.icon }]}>{post.autor}</Text>
      <Text style={[styles.description, { color: colors.text }]} numberOfLines={3}>
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
