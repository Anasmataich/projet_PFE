import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const config: Record<AlertVariant, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  info:    { icon: Info,          bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-200' },
  success: { icon: CheckCircle,   bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50',  text: 'text-amber-800',  border: 'border-amber-200' },
  error:   { icon: XCircle,       bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-200' },
};

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const c = config[variant];
  const Icon = c.icon;
  return (
    <div className={cn('flex gap-3 rounded-lg border p-4', c.bg, c.border, c.text, className)}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="text-sm">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
