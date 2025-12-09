import React, { useState } from 'react';
import { ProductData, GeminiEnhancement, LoadingState } from './types';
import { fetchProductByBarcode } from './services/openFoodFacts';
import { enhanceProductInfo } from './services/gemini';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import { Leaf, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [aiData, setAiData] = useState<GeminiEnhancement | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSearch = async (barcode: string) => {
    setStatus(LoadingState.LOADING_PRODUCT);
    setErrorMsg('');
    setProduct(null);
    setAiData(null);

    try {
      // 1. Fetch Standard Data
      const fetchedProduct = await fetchProductByBarcode(barcode);
      setProduct(fetchedProduct);
      
      // 2. Fetch AI Data
      if (process.env.API_KEY) {
        setStatus(LoadingState.LOADING_AI);
        const enhancedData = await enhanceProductInfo(fetchedProduct);
        setAiData(enhancedData);
      }
      
      setStatus(LoadingState.SUCCESS);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-6">
          <Leaf className="w-8 h-8 text-emerald-500 mr-2" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            SmartPantry
          </h1>
        </div>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Decode your groceries. Get instant storage advice, expiration estimates, and AI-powered serving suggestions.
        </p>
      </div>

      {/* Search */}
      <SearchBar 
        onSearch={handleSearch} 
        isLoading={status === LoadingState.LOADING_PRODUCT || status === LoadingState.LOADING_AI} 
      />

      {/* Error Message */}
      {status === LoadingState.ERROR && (
        <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMsg}</span>
        </div>
      )}

      {/* Result */}
      <div className="transition-all duration-500 ease-out">
        {product && (
            <ProductCard 
                product={product} 
                aiData={aiData} 
                isAiLoading={status === LoadingState.LOADING_AI} 
            />
        )}
      </div>

      {/* Empty State / Prompt */}
      {status === LoadingState.IDLE && (
        <div className="max-w-2xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center opacity-60">
            <div className="p-4">
                <div className="bg-white w-12 h-12 rounded-full mx-auto mb-3 shadow-sm flex items-center justify-center text-emerald-600 font-bold text-xl">1</div>
                <h3 className="font-semibold text-sm">Enter Barcode</h3>
                <p className="text-xs mt-1">Found on the back of packaging</p>
            </div>
            <div className="p-4">
                <div className="bg-white w-12 h-12 rounded-full mx-auto mb-3 shadow-sm flex items-center justify-center text-emerald-600 font-bold text-xl">2</div>
                <h3 className="font-semibold text-sm">Get Insights</h3>
                <p className="text-xs mt-1">Storage tips & expiration logic</p>
            </div>
            <div className="p-4">
                <div className="bg-white w-12 h-12 rounded-full mx-auto mb-3 shadow-sm flex items-center justify-center text-emerald-600 font-bold text-xl">3</div>
                <h3 className="font-semibold text-sm">Ask Gemini</h3>
                <p className="text-xs mt-1">Creative recipes & smart facts</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;