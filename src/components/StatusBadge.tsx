import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'ready' | 'sent-back' | 'pending-review' | 'ready-for-peer-review' | 'in-review';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    'ready': {
      label: 'Ready to Progress',
      className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    },
    'sent-back': {
      label: 'Sent Back to Author',
      className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    },
    'pending-review': {
      label: 'Pending Review',
      className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
    },
    'ready-for-peer-review': {
      label: 'Ready for Peer Review',
      className: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
    },
    'in-review': {
      label: 'In Review',
      className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {label}
    </Badge>
  );
}
