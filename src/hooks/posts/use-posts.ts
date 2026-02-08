import { useQuery } from '@tanstack/react-query';

import { postsService } from '@/services/posts.service';

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
