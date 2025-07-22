import { useQuery } from '@tanstack/react-query';
import { fetchInitiatives } from '../services/azureDevOps';

export function useInitiatives() {
  return useQuery(['initiatives'], fetchInitiatives);
}