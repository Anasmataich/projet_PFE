import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Ajouter un tag…' }: TagInputProps) {
  const [value, setValue] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      onChange([...tags, trimmed]);
    }
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && value) {
      e.preventDefault();
      addTag(value);
    }
    if (e.key === 'Backspace' && !value && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-300 p-2 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-colors">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="hover:text-primary-900">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (value) addTag(value); }}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[100px] border-0 p-0 text-sm focus:outline-none focus:ring-0 placeholder:text-gray-400"
      />
    </div>
  );
}
