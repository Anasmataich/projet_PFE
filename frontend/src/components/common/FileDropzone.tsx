import { useCallback, useState, useRef, type DragEvent } from 'react';
import { Upload, FileText, FileImage, FileSpreadsheet, X, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { formatFileSize } from '@/utils/formatters';
import { validateFile } from '@/utils/validators';
import toast from 'react-hot-toast';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  accept?: string;
}

// ── Icône selon type MIME ─────────────────────────────────────
function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.startsWith('image/'))
    return <FileImage className={cn('text-indigo-500', className)} />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv'))
    return <FileSpreadsheet className={cn('text-emerald-500', className)} />;
  return <FileText className={cn('text-blue-500', className)} />;
}

// ── Extension badge ───────────────────────────────────────────
function ExtBadge({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toUpperCase() ?? 'FILE';
  const colors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700',
    DOCX: 'bg-blue-100 text-blue-700',
    DOC: 'bg-blue-100 text-blue-700',
    XLSX: 'bg-emerald-100 text-emerald-700',
    XLS: 'bg-emerald-100 text-emerald-700',
    PNG: 'bg-purple-100 text-purple-700',
    JPG: 'bg-purple-100 text-purple-700',
    JPEG: 'bg-purple-100 text-purple-700',
    TXT: 'bg-slate-100 text-slate-600',
    CSV: 'bg-teal-100 text-teal-700',
  };
  return (
    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide', colors[ext] ?? 'bg-slate-100 text-slate-600')}>
      {ext}
    </span>
  );
}

// ── Barre de progression chiffrement ─────────────────────────
function EncryptionProgress({ progress }: { progress: number }) {
  const stages = [
    { min: 0,  max: 30,  label: 'Lecture du fichier…',      icon: '📄' },
    { min: 30, max: 60,  label: 'Chiffrement AES-256-GCM…', icon: '🔐' },
    { min: 60, max: 85,  label: 'Transfert sécurisé…',       icon: '📡' },
    { min: 85, max: 100, label: 'Indexation MinIO S3…',      icon: '✅' },
  ];
  const stage = stages.find((s) => progress >= s.min && progress < s.max) ?? stages[3];

  return (
    <div className="w-full space-y-3 animate-fadeIn">
      {/* Icône centrale animée */}
      <div className="flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Anneau animé */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div
            className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent transition-all duration-500"
            style={{
              transform: `rotate(${(progress / 100) * 360}deg)`,
              transition: 'transform 0.3s linear',
            }}
          />
          <span className="text-2xl z-10">{stage.icon}</span>
        </div>
      </div>

      {/* Label étape */}
      <p className="text-center text-sm font-semibold text-slate-700">{stage.label}</p>

      {/* Barre de progression shimmer */}
      <div className="relative h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #1a4a9e, #3b82f6, #1a4a9e)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Pourcentage + indicateur sécurité */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <Lock className="h-3 w-3" />
          <span>Transfert chiffré</span>
        </div>
        <span className="font-bold text-slate-700 tabular-nums">{progress}%</span>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────
export function FileDropzone({ onFileSelect, selectedFile, isUploading = false, uploadProgress = 0, accept }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) { toast.error(error); return; }
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // ── État upload en cours ──
  if (isUploading) {
    return (
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-8">
        <EncryptionProgress progress={uploadProgress} />
      </div>
    );
  }

  // ── Fichier sélectionné ──
  if (selectedFile) {
    return (
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 p-6 animate-scaleIn">
        <div className="flex items-center gap-4">
          {/* Icône fichier */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <FileTypeIcon mimeType={selectedFile.type} className="h-7 w-7" />
          </div>

          {/* Infos fichier */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
              <ExtBadge name={selectedFile.name} />
            </div>
            <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Fichier validé · Prêt pour l'upload</span>
            </div>
          </div>

          {/* Bouton changer */}
          <button
            type="button"
            onClick={() => { onFileSelect(null as unknown as File); inputRef.current?.click(); }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Changer le fichier"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />

        {/* Hint chiffrement */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 ring-1 ring-slate-100">
          <Lock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <p className="text-[11px] text-slate-500">
            Ce fichier sera chiffré en <span className="font-semibold text-slate-700">AES-256-GCM</span> avant stockage sur MinIO S3
          </p>
        </div>
      </div>
    );
  }

  // ── Zone de dépôt vide ──
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'dropzone min-h-[200px]',
        isDragging && 'dropzone-active scale-[1.01]'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />

      {/* Icône animée */}
      <div className={cn(
        'relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-300',
        isDragging
          ? 'bg-blue-100 scale-110'
          : 'bg-slate-100'
      )}>
        {isDragging && (
          <div className="absolute inset-0 rounded-3xl bg-blue-200 animate-pulseRing" />
        )}
        <Upload className={cn(
          'h-9 w-9 transition-colors duration-200 relative z-10',
          isDragging ? 'text-[#1a4a9e]' : 'text-slate-400'
        )} />
      </div>

      {/* Texte */}
      <p className="text-sm font-semibold text-slate-700 mb-1">
        {isDragging
          ? 'Relâchez pour déposer le fichier'
          : <><span className="text-[#1a4a9e]">Cliquez pour sélectionner</span> ou glissez un fichier ici</>
        }
      </p>
      <p className="text-xs text-slate-400 mb-5">PDF, Word, Excel, Images — 50 Mo maximum</p>

      {/* Formats acceptés */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {['PDF', 'DOCX', 'XLSX', 'PNG', 'JPG', 'TXT'].map((ext) => (
          <ExtBadge key={ext} name={`.${ext.toLowerCase()}`} />
        ))}
      </div>

      {/* Sécurité */}
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
        <Lock className="h-3.5 w-3.5" />
        <span>Chiffrement AES-256 automatique · Stockage sécurisé MinIO</span>
      </div>
    </div>
  );
}