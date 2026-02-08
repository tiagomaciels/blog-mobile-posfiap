import { AxiosError } from 'axios';

import { api } from '@/lib/api';
import type { CreatePostDto, Post, UpdatePostDto } from '@/types/post';

async function handleRequest<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw new Error(
        typeof error.response.data === 'string'
          ? error.response.data
          : ((error.response.data as { message?: string }).message ?? error.message)
      );
    }
    throw error;
  }
}

function sortByNewest(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

export const postsService = {
  async getAll(): Promise<Post[]> {
    return handleRequest(async () => {
      const { data } = await api.get<Post[]>('/posts');
      return sortByNewest(data);
    });
  },

  async search(keyword: string): Promise<Post[]> {
    return handleRequest(async () => {
      const { data } = await api.get<Post[]>('/posts/search', {
        params: { q: keyword },
      });
      return sortByNewest(data);
    });
  },

  async getById(id: string): Promise<Post> {
    return handleRequest(async () => {
      const { data } = await api.get<Post>(`/posts/${id}`);
      return data;
    });
  },

  async create(dto: CreatePostDto): Promise<Post> {
    return handleRequest(async () => {
      const { data } = await api.post<Post>('/posts', dto);
      return data;
    });
  },

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    return handleRequest(async () => {
      const { data } = await api.put<Post>(`/posts/${id}`, dto);
      return data;
    });
  },

  async delete(id: string): Promise<void> {
    return handleRequest(async () => {
      await api.delete(`/posts/${id}`);
    });
  },
};
