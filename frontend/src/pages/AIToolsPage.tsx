import { useState } from 'react';
import { Sparkles, Search, ScanLine, Wand2 } from 'lucide-react';
import { SemanticSearch } from '@/components/ai/SemanticSearch';
import { AIToolsPanel } from '@/components/ai/AIToolsPanel';
import { OCRViewer } from '@/components/ai/OCRViewer';

type Tab = 'search' | 'analyze' | 'ocr';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'search', label: 'Recherche sémantique', icon: Search },
  { key: 'analyze', label: 'Analyse IA', icon: Wand2 },
  { key: 'ocr', label: 'OCR', icon: ScanLine },
];

export function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('search');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Sparkles className="h-6 w-6 text-primary-600" />
          Outils d'Intelligence Artificielle
        </h1>
        <p className="text-sm text-gray-500 mt-1">Recherche sémantique, classification, résumé et OCR</p>
      </div>

      <div className="card">
        <div className="flex border-b border-gray-200">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'search' && <SemanticSearch />}
          {activeTab === 'analyze' && <AIToolsPanel />}
          {activeTab === 'ocr' && <OCRViewer />}
        </div>
      </div>
    </div>
  );
}
