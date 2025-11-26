import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CheckStatus } from '@/types/manuscript';

interface StoplightIndicatorProps {
  status: CheckStatus;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StoplightIndicator({ status, score, showScore = true, size = 'md' }: StoplightIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      {status === 'pass' && (
        <CheckCircle className={cn(iconSize, 'text-success')} />
      )}
      {status === 'warning' && (
        <AlertCircle className={cn(iconSize, 'text-warning')} />
      )}
      {status === 'fail' && (
        <XCircle className={cn(iconSize, 'text-destructive')} />
      )}
      {showScore && score !== undefined && (
        <span className={cn(
          'text-sm font-medium',
          status === 'pass' && 'text-success',
          status === 'warning' && 'text-warning',
          status === 'fail' && 'text-destructive'
        )}>
          {score}%
        </span>
      )}
    </div>
  );
}
