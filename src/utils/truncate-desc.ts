import { DESCRIPTION_MAX_LENGTH } from '@/constants/constants';

export function truncateDescription(conteudo: string): string {
  const trimmed = conteudo.trim();
  if (trimmed.length <= DESCRIPTION_MAX_LENGTH) return trimmed;
  return trimmed.slice(0, DESCRIPTION_MAX_LENGTH) + '...';
}
