import { useForm } from '@tanstack/react-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { CreatePostFormData } from '@/schemas/post';
import { createPostSchema } from '@/schemas/post';

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
  return 'Erro de validação';
}

interface PostFormProps {
  defaultValues: CreatePostFormData;
  onSubmit: (values: CreatePostFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: 'Enviar' | 'Salvar';
}

export function PostForm({ defaultValues, onSubmit, isSubmitting, submitLabel }: PostFormProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createPostSchema,
    },
    onSubmit: async ({ value }) => {
      const result = createPostSchema.safeParse(value);
      if (!result.success) {
        const fieldErrors = result.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
          const key = (issue.path[0] as string) ?? '_form';
          if (!acc[key]) acc[key] = [];
          acc[key].push(issue.message);
          return acc;
        }, {});
        form.setFieldMeta('titulo', (prev) => ({ ...prev, errors: fieldErrors.titulo ?? [] }));
        form.setFieldMeta('conteudo', (prev) => ({ ...prev, errors: fieldErrors.conteudo ?? [] }));
        form.setFieldMeta('autor', (prev) => ({ ...prev, errors: fieldErrors.autor ?? [] }));
        return;
      }
      await onSubmit(result.data as CreatePostFormData);
    },
  });

  const handleSubmit = async () => {
    const value = form.state.values;
    const result = createPostSchema.safeParse(value);
    if (!result.success) {
      const fieldErrors = result.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
        const key = (issue.path[0] as string) ?? '_form';
        if (!acc[key]) acc[key] = [];
        acc[key].push(issue.message);
        return acc;
      }, {});
      form.setFieldMeta('titulo', (prev) => ({ ...prev, errors: fieldErrors.titulo ?? [] }));
      form.setFieldMeta('conteudo', (prev) => ({ ...prev, errors: fieldErrors.conteudo ?? [] }));
      form.setFieldMeta('autor', (prev) => ({ ...prev, errors: fieldErrors.autor ?? [] }));
      return;
    }
    await onSubmit(result.data as CreatePostFormData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <form.Field
          name="titulo"
          validators={{
            onBlur: ({ value }) => {
              const result = createPostSchema.shape.titulo.safeParse(value);
              return result.success ? undefined : (result.error.issues[0]?.message ?? 'Título inválido');
            },
          }}
        >
          {(field) => (
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Título</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, borderColor: colors.icon, color: colors.text },
                ]}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Título do post"
                placeholderTextColor={colors.icon}
              />
              {field.state.meta.errors.length > 0 && (
                <Text style={styles.error}>{getErrorMessage(field.state.meta.errors[0])}</Text>
              )}
            </View>
          )}
        </form.Field>

        <form.Field name="conteudo">
          {(field) => (
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Conteúdo</Text>
              <TextInput
                style={[
                  styles.inputMultiline,
                  { backgroundColor: colors.background, borderColor: colors.icon, color: colors.text },
                ]}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Conteúdo do post"
                placeholderTextColor={colors.icon}
                multiline
                numberOfLines={6}
              />
              {field.state.meta.errors.length > 0 && (
                <Text style={styles.error}>{getErrorMessage(field.state.meta.errors[0])}</Text>
              )}
            </View>
          )}
        </form.Field>

        <form.Field name="autor">
          {(field) => (
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Autor</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, borderColor: colors.icon, color: colors.text },
                ]}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Nome do autor"
                placeholderTextColor={colors.icon}
              />
              {field.state.meta.errors.length > 0 && (
                <Text style={styles.error}>{getErrorMessage(field.state.meta.errors[0])}</Text>
              )}
            </View>
          )}
        </form.Field>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={[styles.submitButton, { backgroundColor: colors.tint }]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.submitButtonText, { color: colors.background }]}>{submitLabel}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputMultiline: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
