import { useLocalStorage } from './useLocalStorage';
import { seedTasks } from '../data/seedData';

const seedClients = Array.from(
  new Set(seedTasks.map((t) => t.client).filter((c): c is string => !!c)),
).sort();

export function useClients() {
  const [clients, setClients] = useLocalStorage<string[]>('second-brain-clients', seedClients);

  function addClient(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setClients((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed].sort()));
  }

  return { clients, addClient };
}
