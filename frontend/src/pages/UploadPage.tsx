import { Upload } from 'lucide-react';
import { UploadForm } from '@/components/documents/UploadForm';

export function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Upload className="h-6 w-6 text-primary-600" />
          Uploader un document
        </h1>
        <p className="text-sm text-gray-500 mt-1">Ajoutez un nouveau document à la plateforme</p>
      </div>
      <div className="card p-6">
        <UploadForm />
      </div>
    </div>
  );
}
