export function formatDeadline(deadline: string): string {
  if (!deadline) return '';
  const due = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1 && days <= 6) return due.toLocaleDateString(undefined, { weekday: 'short' });
  if (days < -1) return `${Math.abs(days)}d overdue`;
  return due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
