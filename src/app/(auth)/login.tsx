import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import type { UserRole } from '@/contexts/auth-context';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { emailSchema, loginSchema } from '@/schemas/auth';

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

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      senha: '',
      role: undefined as UserRole | undefined,
    },
  });

  const handleSubmitAs = async (role: UserRole) => {
    const value = { ...form.state.values, role };
    const result = loginSchema.safeParse(value);
    if (!result.success) {
      const fieldErrors = result.error.issues.reduce<Record<string, string[]>>((acc, issue) => {
        const key = (issue.path[0] as string) ?? '_form';
        if (!acc[key]) acc[key] = [];
        acc[key].push(issue.message);
        return acc;
      }, {});
      form.setFieldMeta('email', (prev) => ({
        ...prev,
        errors: fieldErrors.email ?? [],
      }));
      form.setFieldMeta('senha', (prev) => ({
        ...prev,
        errors: fieldErrors.senha ?? [],
      }));
      return;
    }
    setIsSubmitting(true);
    try {
      await login({
        nome: value.email.split('@')[0],
        email: value.email,
        role,
      });
      router.replace('/(authenticated)/home');
    } finally {
      setIsSubmitting(false);
    }
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
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Blog FIAP</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>Entre para acessar o aplicativo</Text>
        </View>

        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => {
              const result = emailSchema.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message ?? 'E-mail inválido';
            },
          }}
        >
          {(field) => (
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.icon,
                    color: colors.text,
                  },
                ]}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="seu@email.com"
                placeholderTextColor={colors.icon}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {field.state.meta.errors.length > 0 && (
                <Text style={styles.error}>{getErrorMessage(field.state.meta.errors[0])}</Text>
              )}
            </View>
          )}
        </form.Field>

        <form.Field name="senha">
          {(field) => (
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.icon,
                    color: colors.text,
                  },
                ]}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="••••••••"
                placeholderTextColor={colors.icon}
                secureTextEntry
              />
              {field.state.meta.errors.length > 0 && (
                <Text style={styles.error}>{getErrorMessage(field.state.meta.errors[0])}</Text>
              )}
            </View>
          )}
        </form.Field>

        <View style={styles.roleSection}>
          <Text style={[styles.label, { color: colors.text }]}>Tipo de usuário</Text>
          <View style={styles.roleButtons}>
            <Pressable
              style={[styles.roleButton, { borderColor: colors.tint, backgroundColor: colors.background }]}
              onPress={() => handleSubmitAs('professor')}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.tint} />
              ) : (
                <Text style={[styles.roleButtonText, { color: colors.tint }]}>Entrar como Professor</Text>
              )}
            </Pressable>
            <Pressable
              style={[styles.roleButton, { borderColor: colors.tint, backgroundColor: colors.background }]}
              onPress={() => handleSubmitAs('aluno')}
              disabled={isSubmitting}
            >
              <Text style={[styles.roleButtonText, { color: colors.tint }]}>Entrar como Aluno</Text>
            </Pressable>
          </View>
        </View>

        <form.Subscribe selector={(state) => state.errors}>
          {(errors) =>
            errors.length > 0 ? (
              <View style={styles.formErrors}>
                {errors.map((error, i) => (
                  <Text key={i} style={styles.error}>
                    {getErrorMessage(error)}
                  </Text>
                ))}
              </View>
            ) : null
          }
        </form.Subscribe>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  roleSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  roleButtons: {
    gap: 12,
    marginTop: 8,
  },
  roleButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formErrors: {
    marginTop: 8,
  },
});
