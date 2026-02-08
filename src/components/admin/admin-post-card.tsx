import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Post } from '@/types/post';
import { formatDate } from '@/utils/format-date';
import { truncateDescription } from '@/utils/truncate-desc';

interface AdminPostCardProps {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}

export function AdminPostCard({ post, onEdit, onDelete }: AdminPostCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const description = truncateDescription(post.conteudo);
  const formattedDate = formatDate(post.createdAt);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.icon,
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
      {formattedDate ? <Text style={[styles.date, { color: colors.icon }]}>{formattedDate}</Text> : null}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.7}
          style={[styles.button, styles.editButton, { borderColor: colors.tint }]}
        >
          <Text style={[styles.buttonText, { color: colors.tint }]}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} activeOpacity={0.7} style={[styles.button, styles.deleteButton]}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButton: {
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
