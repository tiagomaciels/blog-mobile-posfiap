import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { postsService } from '@/services/posts.service';
import type { CreatePostDto, UpdatePostDto } from '@/types/post';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postsService.getAll(),
  });
}

export function useSearchPosts(keyword: string) {
  return useQuery({
    queryKey: ['posts', 'search', keyword],
    queryFn: () => postsService.search(keyword),
    enabled: keyword.trim().length > 0,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: CreatePostDto) => postsService.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.replace({ pathname: '/(authenticated)/post/[id]', params: { id: data._id } });
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: UpdatePostDto) => postsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
      router.replace({ pathname: '/(authenticated)/post/[id]', params: { id } });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
    },
  });
}
