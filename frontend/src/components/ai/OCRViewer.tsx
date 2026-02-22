import { useState } from 'react';
import { ScanLine, Upload } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { FileDropzone } from '@/components/common/FileDropzone';
import { Spinner } from '@/components/common/Spinner';
import api, { type ApiResponse } from '@/services/api';
import toast from 'react-hot-toast';

export function OCRViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOCR = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<ApiResponse<{ text: string }>>('/ai/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120_000,
      });
      setExtractedText(data.data?.text ?? '');
    } catch {
      toast.error("Erreur lors de l'OCR");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone onFileSelect={setFile} selectedFile={file} accept="application/pdf,image/*" />

      <Button onClick={handleOCR} disabled={!file} loading={isProcessing}>
        <ScanLine className="h-4 w-4" /> Lancer l'OCR
      </Button>

      {isProcessing && (
        <div className="flex flex-col items-center py-8">
          <Spinner size="lg" className="text-primary-600" />
          <p className="text-sm text-gray-500 mt-2">Extraction du texte en cours…</p>
        </div>
      )}

      {extractedText && (
        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Upload className="h-4 w-4" /> Texte extrait
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-600 max-h-[400px] overflow-y-auto font-mono bg-gray-50 rounded-lg p-4">
            {extractedText}
          </pre>
        </div>
      )}
    </div>
  );
}
