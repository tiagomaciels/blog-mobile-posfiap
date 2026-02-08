import { useQuery } from '@tanstack/react-query';

import { postsService } from '@/services/posts.service';

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsService.getById(id),
    enabled: !!id,
  });
}
