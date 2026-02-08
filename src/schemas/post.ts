import { z } from 'zod';

export const createPostSchema = z.object({
  titulo: z.string().min(3, { message: 'Título deve ter no mínimo 3 caracteres' }),
  conteudo: z.string().min(1, { message: 'Conteúdo é obrigatório' }),
  autor: z.string().min(1, { message: 'Autor é obrigatório' }),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
