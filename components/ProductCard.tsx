import React, { useState } from 'react';
import { ProductData, GeminiEnhancement } from '../types';
import { Info, Snowflake, Calendar, Flame, Sparkles, ChefHat, Lightbulb, Image as ImageIcon, Loader2, Heart, Check, PlusCircle, AlertTriangle } from 'lucide-react';
import { generateStorageImage } from '../services/gemini';

interface ProductCardProps {
  product: ProductData;
  aiData: GeminiEnhancement | null;
  isAiLoading: boolean;
  onSaveRecipe: (product: ProductData, aiData: GeminiEnhancement) => void;
  onAddToBuilder: (product: ProductData) => void;
  isSaved?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, aiData, isAiLoading, onSaveRecipe, onAddToBuilder, isSaved = false }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationError, setGenerationError] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [justAddedToBuilder, setJustAddedToBuilder] = useState(false);

  const handleVisualize = async () => {
    if (!aiData) return;
    setIsGeneratingImage(true);
    setGenerationError(false);
    try {
        const imgData = await generateStorageImage(product.name, aiData.aiStorageTip);
        if (imgData) {
            setGeneratedImage(imgData);
        } else {
            setGenerationError(true);
        }
    } catch (e) {
        setGenerationError(true);
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleSave = () => {
      if (aiData) {
        onSaveRecipe(product, aiData);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      }
  };

  const handleAddToBuilder = () => {
    onAddToBuilder(product);
    setJustAddedToBuilder(true);
    setTimeout(() => setJustAddedToBuilder(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
      
      {/* Left Column: Image & Basic Info */}
      <div className="md:col-span-1 flex flex-col items-center text-center space-y-4">
        <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 relative group">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="object-contain w-full h-full p-4 transition-transform group-hover:scale-105 duration-300"
            />
          ) : (
            <div className="text-slate-300">No Image</div>
          )}
          <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
            {product.categories.split(' ')[0] || 'Food'}
          </div>
        </div>
        
        <div className="w-full">
          <h2 className="text-2xl font-bold text-slate-800 leading-tight">{product.name}</h2>
          <p className="text-slate-500 font-medium">{product.brand}</p>
        </div>

        <div className="w-full bg-orange-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-orange-700">
                <Flame className="w-5 h-5" />
                <span className="font-medium text-sm">Energy</span>
            </div>
            <span className="font-bold text-orange-900">{product.calories100g} kcal/100g</span>
        </div>

        {/* Add to Meal Button */}
        <button 
            onClick={handleAddToBuilder}
            disabled={product.calories100g === "N/A"}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                justAddedToBuilder 
                ? "bg-indigo-100 text-indigo-700" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {justAddedToBuilder ? (
                <>
                    <Check className="w-5 h-5" />
                    Added
                </>
            ) : (
                <>
                    <PlusCircle className="w-5 h-5" />
                    Add to Meal
                </>
            )}
        </button>
      </div>

      {/* Right Column: Details & AI */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Standard Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Storage */}
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <div className="flex items-center space-x-2 mb-2 text-blue-700">
                    <Snowflake className="w-5 h-5" />
                    <h3 className="font-bold text-sm uppercase tracking-wide">Storage (Std)</h3>
                </div>
                <p className="text-blue-900 text-sm leading-relaxed">
                    {product.storageTip}
                </p>
            </div>

            {/* Expiration */}
            <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                <div className="flex items-center space-x-2 mb-2 text-purple-700">
                    <Calendar className="w-5 h-5" />
                    <h3 className="font-bold text-sm uppercase tracking-wide">After Opening</h3>
                </div>
                <p className="text-purple-900 text-sm leading-relaxed">
                    {product.expirationOpened}
                </p>
            </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Unopened Expiration: {product.expirationClosed}</p>
        </div>

        {/* AI Enhanced Section */}
        <div className="border-t-2 border-slate-100 pt-6 mt-6">
            <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-slate-800">Gemini AI Insights</h3>
            </div>

            {isAiLoading ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-20 bg-slate-200 rounded w-full"></div>
                </div>
            ) : aiData ? (
                <div className="space-y-4">
                     {/* Smart Tip & Visualizer */}
                     <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 relative overflow-hidden transition-all">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-200 to-transparent opacity-30 rounded-bl-full -mr-4 -mt-4"></div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start space-x-3">
                                <Lightbulb className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-indigo-900 text-sm mb-1">Smart Storage Tip</h4>
                                    <p className="text-indigo-800 text-sm">{aiData.aiStorageTip}</p>
                                </div>
                            </div>

                            {/* Visualization Logic */}
                            {generatedImage ? (
                                <div className="mt-2 w-full rounded-lg overflow-hidden border border-indigo-200 shadow-sm animate-in fade-in zoom-in duration-500">
                                    <img src={generatedImage} alt="Storage instruction" className="w-full h-auto object-cover" />
                                    <div className="bg-indigo-900/10 p-2 text-center text-xs text-indigo-700 font-medium">
                                        Visualized by Gemini
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 ml-8">
                                    <button 
                                        onClick={handleVisualize}
                                        disabled={isGeneratingImage}
                                        className="text-xs flex items-center gap-2 px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors font-medium shadow-sm disabled:opacity-70"
                                    >
                                        {isGeneratingImage ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Generating photo...
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-3 h-3" />
                                                Visualize Storage
                                            </>
                                        )}
                                    </button>
                                    {generationError && (
                                        <div className="flex items-center text-red-500 text-xs animate-in fade-in slide-in-from-left-2">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            Failed to generate
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recipe Idea & Save */}
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 relative overflow-hidden">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 pr-8">
                                <ChefHat className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-emerald-900 text-sm mb-1">Quick Idea</h4>
                                    <p className="text-emerald-800 text-sm italic">"{aiData.recipeIdea}"</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleSave}
                                disabled={isSaved && !justSaved}
                                className={`flex-shrink-0 p-2 rounded-full transition-all ${
                                    justSaved || isSaved
                                    ? "bg-emerald-200 text-emerald-700"
                                    : "bg-white text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 shadow-sm"
                                }`}
                                title="Save to Cookbook"
                            >
                                {justSaved ? <Check className="w-5 h-5" /> : <Heart className={`w-5 h-5 ${isSaved ? "fill-emerald-700" : ""}`} />}
                            </button>
                        </div>
                    </div>

                     <div className="text-xs text-slate-400 italic text-right">
                        Fun Fact: {aiData.funFact}
                    </div>
                </div>
            ) : (
                <div className="text-slate-400 text-sm italic">AI insights unavailable.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;