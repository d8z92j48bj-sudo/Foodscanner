import React, { useState } from 'react';
import { Search, Loader2, ScanBarcode } from 'lucide-react';
import ScannerModal from './ScannerModal';

interface SearchBarProps {
  onSearch: (barcode: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const handleScanDetected = (barcode: string) => {
    setIsScanning(false);
    setInput(barcode);
    onSearch(barcode);
  };

  const handleDemo = () => {
    const demoBarcode = "3017620422003"; // Nutella (Example)
    setInput(demoBarcode);
    onSearch(demoBarcode);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter barcode (e.g., 3017620422003)..."
          className="w-full pl-6 pr-28 py-4 text-lg rounded-full border-2 border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none shadow-sm transition-all text-slate-700 placeholder:text-slate-400"
          disabled={isLoading}
        />
        
        <div className="absolute right-2 flex items-center space-x-1">
          {/* Scan Button */}
          <button
            type="button"
            onClick={() => setIsScanning(true)}
            disabled={isLoading}
            className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
            title="Scan Barcode"
          >
            <ScanBarcode className="w-6 h-6" />
          </button>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !input}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Search className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>

      <div className="mt-2 text-center">
        <button 
          onClick={handleDemo}
          className="text-xs text-slate-500 hover:text-emerald-600 underline"
        >
          Try demo barcode (Nutella)
        </button>
      </div>

      {isScanning && (
        <ScannerModal 
            onDetected={handleScanDetected} 
            onClose={() => setIsScanning(false)} 
        />
      )}
    </div>
  );
};

export default SearchBar;
