/**
 * Tipo Post retornado pela API REST do backend
 */
export interface Post {
  _id: string;
  titulo: string;
  conteudo: string;
  autor: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO para criação de post
 */
export interface CreatePostDto {
  titulo: string;
  conteudo: string;
  autor: string;
}

/**
 * DTO para atualização de post (campos opcionais)
 */
export type UpdatePostDto = Partial<CreatePostDto>;
