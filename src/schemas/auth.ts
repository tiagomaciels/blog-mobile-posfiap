import { z } from 'zod';

export const emailSchema = z.email({ error: 'E-mail inválido' });

export const loginSchema = z.object({
  email: emailSchema,
  senha: z.string().min(1, { error: 'Senha é obrigatória' }),
  role: z.enum(['professor', 'aluno'], {
    error: 'Selecione o tipo de usuário',
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
