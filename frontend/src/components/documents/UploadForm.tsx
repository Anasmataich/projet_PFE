import { useState, type FormEvent } from 'react';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { FileDropzone } from '@/components/common/FileDropzone';
import { TagInput } from './TagInput';
import { CATEGORY_LABELS, CONFIDENTIALITY_LABELS } from '@/utils/constants';
import { validateRequired } from '@/utils/validators';
import { documentService } from '@/services/documentService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { DocumentCategory, ConfidentialityLevel } from '@/types/document.types';

export function UploadForm() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('CORRESPONDANCE');
  const [confidentialityLevel, setConfidentialityLevel] = useState<ConfidentialityLevel>('INTERNE');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) { setError('Veuillez sélectionner un fichier'); return; }
    const titleErr = validateRequired(title, 'Le titre');
    if (titleErr) { setError(titleErr); return; }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('confidentialityLevel', confidentialityLevel);
      formData.append('description', description);
      if (tags.length > 0) formData.append('tags', tags.join(','));

      await documentService.upload(formData);
      toast.success('Document uploadé avec succès');
      navigate('/documents');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <FileDropzone onFileSelect={setFile} selectedFile={file} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="label">Titre du document *</label>
          <input id="title" className="input" placeholder="Ex: Décision N°123" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label htmlFor="category" className="label">Catégorie *</label>
          <select id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)}>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="confidentialityLevel" className="label">Confidentialité</label>
          <select id="confidentialityLevel" className="input" value={confidentialityLevel} onChange={(e) => setConfidentialityLevel(e.target.value as ConfidentialityLevel)}>
            {Object.entries(CONFIDENTIALITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" className="input min-h-[80px] resize-y" placeholder="Décrivez le contenu du document…" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Tags</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => navigate('/documents')}>Annuler</Button>
        <Button type="submit" loading={isUploading}>Uploader le document</Button>
      </div>
    </form>
  );
}
