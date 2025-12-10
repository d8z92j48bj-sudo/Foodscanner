import React, { useState, useEffect } from 'react';
import { ProductData, GeminiEnhancement, LoadingState, SavedRecipe, RecipeIngredient, CustomRecipe } from './types';
import { fetchProductByBarcode } from './services/openFoodFacts';
import { enhanceProductInfo } from './services/gemini';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import SavedRecipesModal from './components/SavedRecipesModal';
import RecipeBuilderModal from './components/RecipeBuilderModal';
import VeoModal from './components/VeoModal';
import { Leaf, AlertCircle, BookOpen, Calculator, PenLine, Clapperboard } from 'lucide-react';

const App: React.FC = () => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [aiData, setAiData] = useState<GeminiEnhancement | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Saved Data State
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // Recipe Builder State
  const [builderIngredients, setBuilderIngredients] = useState<RecipeIngredient[]>([]);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // Veo Modal State
  const [showVeoModal, setShowVeoModal] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('smartPantry_recipes');
    const custom = localStorage.getItem('smartPantry_custom_recipes');
    if (saved) {
        try {
            setSavedRecipes(JSON.parse(saved));
        } catch (e) { console.error(e); }
    }
    if (custom) {
        try {
            setCustomRecipes(JSON.parse(custom));
        } catch (e) { console.error(e); }
    }
  }, []);

  // Save to LocalStorage on update
  useEffect(() => {
    localStorage.setItem('smartPantry_recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    localStorage.setItem('smartPantry_custom_recipes', JSON.stringify(customRecipes));
  }, [customRecipes]);

  const handleSearch = async (barcode: string) => {
    setStatus(LoadingState.LOADING_PRODUCT);
    setErrorMsg('');
    setProduct(null);
    setAiData(null);

    try {
      const fetchedProduct = await fetchProductByBarcode(barcode);
      setProduct(fetchedProduct);
      
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

  // --- Saved Ideas Logic ---
  const saveRecipe = (prod: ProductData, ai: GeminiEnhancement) => {
      const newRecipe: SavedRecipe = {
          id: crypto.randomUUID(),
          dateSaved: Date.now(),
          product: prod,
          aiData: ai
      };
      setSavedRecipes(prev => [newRecipe, ...prev]);
  };

  const deleteRecipe = (id: string) => {
      setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  const deleteCustomRecipe = (id: string) => {
    setCustomRecipes(prev => prev.filter(r => r.id !== id));
  };

  // --- Recipe Builder Logic ---
  const addToBuilder = (prod: ProductData) => {
    const calories = typeof prod.calories100g === 'number' ? prod.calories100g : 0;
    
    const newIngredient: RecipeIngredient = {
      id: crypto.randomUUID(),
      productName: prod.name,
      calories100g: calories,
      amountGrams: 100 // Default to 100g
    };

    setBuilderIngredients(prev => [...prev, newIngredient]);
  };

  const addManualIngredient = (name: string, cals: number, grams: number) => {
    const newIngredient: RecipeIngredient = {
      id: crypto.randomUUID(),
      productName: name,
      calories100g: cals,
      amountGrams: grams
    };
    setBuilderIngredients(prev => [...prev, newIngredient]);
  };

  const updateIngredient = (id: string, grams: number) => {
    setBuilderIngredients(prev => prev.map(ing => 
      ing.id === id ? { ...ing, amountGrams: grams } : ing
    ));
  };

  const removeIngredient = (id: string) => {
    setBuilderIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const saveCustomRecipe = (name: string, instructions: string) => {
    const totalCals = builderIngredients.reduce((sum, item) => sum + (item.calories100g * (item.amountGrams / 100)), 0);
    
    const newCustomRecipe: CustomRecipe = {
      id: crypto.randomUUID(),
      name,
      dateCreated: Date.now(),
      ingredients: [...builderIngredients],
      totalCalories: totalCals,
      instructions
    };

    setCustomRecipes(prev => [newCustomRecipe, ...prev]);
    setBuilderIngredients([]); // Clear builder
    setShowBuilderModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Top Bar Actions */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex flex-wrap gap-3 justify-end">
        <button 
            onClick={() => setShowVeoModal(true)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-violet-600 hover:border-violet-200 transition-all font-medium text-sm"
        >
            <Clapperboard className="w-4 h-4" />
            <span className="hidden sm:inline">Veo Studio</span>
        </button>

        <button 
            onClick={() => setShowBuilderModal(true)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all font-medium text-sm"
        >
            <PenLine className="w-4 h-4" />
            <span className="hidden sm:inline">Write Recipe</span>
        </button>

        <button 
            onClick={() => setShowBuilderModal(true)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all font-medium text-sm relative"
        >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Calculator</span>
            {builderIngredients.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                    {builderIngredients.length}
                </span>
            )}
        </button>

        <button 
            onClick={() => setShowSavedModal(true)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-all font-medium text-sm"
        >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Cookbook</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full ml-1 font-bold">
                {savedRecipes.length + customRecipes.length}
            </span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12 mt-8 sm:mt-0">
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
                onSaveRecipe={saveRecipe}
                onAddToBuilder={addToBuilder}
                isSaved={savedRecipes.some(r => r.product.barcode === product.barcode && r.aiData.recipeIdea === aiData?.recipeIdea)}
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

      {/* Saved Recipes Modal */}
      {showSavedModal && (
        <SavedRecipesModal 
            recipes={savedRecipes} 
            customRecipes={customRecipes}
            onClose={() => setShowSavedModal(false)} 
            onDeleteRecipe={deleteRecipe}
            onDeleteCustomRecipe={deleteCustomRecipe}
        />
      )}

      {/* Recipe Builder Modal */}
      {showBuilderModal && (
        <RecipeBuilderModal 
            ingredients={builderIngredients}
            onUpdateIngredient={updateIngredient}
            onRemoveIngredient={removeIngredient}
            onAddManualIngredient={addManualIngredient}
            onSaveRecipe={saveCustomRecipe}
            onClose={() => setShowBuilderModal(false)}
        />
      )}

      {/* Veo Studio Modal */}
      {showVeoModal && (
        <VeoModal 
            onClose={() => setShowVeoModal(false)}
        />
      )}
    </div>
  );
};

export default App;
