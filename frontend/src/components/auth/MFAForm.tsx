import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';

interface MFAFormProps {
  onSubmit: (token: string) => Promise<void>;
  isLoading: boolean;
}

const CODE_LENGTH = 6;

export function MFAForm({ onSubmit, isLoading }: MFAFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const code = digits.join('');
    if (code.length !== CODE_LENGTH) { setError('Entrez le code à 6 chiffres'); return; }
    try {
      await onSubmit(code);
    } catch {
      setError('Code invalide. Veuillez réessayer.');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputs.current[0]?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-primary-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Vérification MFA</h3>
        <p className="text-sm text-gray-500 mt-1">Entrez le code de votre application d'authentification</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex justify-center gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-12 w-10 rounded-lg border border-gray-300 text-center text-lg font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
        ))}
      </div>

      <Button type="submit" loading={isLoading} className="w-full">
        Vérifier
      </Button>
    </form>
  );
}
