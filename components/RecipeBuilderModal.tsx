import React, { useState, useMemo } from 'react';
import { RecipeIngredient, CustomRecipe } from '../types';
import { X, Trash2, Save, Calculator, Plus, Minus, Utensils, PenLine } from 'lucide-react';

interface RecipeBuilderModalProps {
  ingredients: RecipeIngredient[];
  onUpdateIngredient: (id: string, grams: number) => void;
  onRemoveIngredient: (id: string) => void;
  onAddManualIngredient: (name: string, cals: number, grams: number) => void;
  onSaveRecipe: (name: string, instructions: string) => void;
  onClose: () => void;
}

const RecipeBuilderModal: React.FC<RecipeBuilderModalProps> = ({ 
  ingredients, 
  onUpdateIngredient, 
  onRemoveIngredient, 
  onAddManualIngredient,
  onSaveRecipe,
  onClose 
}) => {
  const [recipeName, setRecipeName] = useState('');
  const [instructions, setInstructions] = useState('');

  // Manual Entry State
  const [manualName, setManualName] = useState('');
  const [manualCals, setManualCals] = useState('');
  const [manualGrams, setManualGrams] = useState('100');

  const totalCalories = useMemo(() => {
    return ingredients.reduce((sum, item) => {
      return sum + (item.calories100g * (item.amountGrams / 100));
    }, 0);
  }, [ingredients]);

  const handleAddManual = (e: React.FormEvent) => {
      e.preventDefault();
      if (manualName && manualCals) {
          onAddManualIngredient(manualName, Number(manualCals), Number(manualGrams) || 100);
          // Reset form
          setManualName('');
          setManualCals('');
          setManualGrams('100');
      }
  };

  const handleSave = () => {
    if (recipeName.trim() && ingredients.length > 0) {
      onSaveRecipe(recipeName, instructions);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
              <PenLine className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Recipe Writer</h2>
              <p className="text-sm text-slate-500">Create custom meals & calculate stats</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Manual Entry Form */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Custom Ingredient
              </h3>
              <form onSubmit={handleAddManual} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input 
                      type="text" 
                      placeholder="Name (e.g. Rice)"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                      required
                  />
                  <input 
                      type="number" 
                      placeholder="kcal/100g"
                      value={manualCals}
                      onChange={(e) => setManualCals(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                      required
                  />
                   <div className="flex relative">
                        <input 
                            type="number" 
                            placeholder="Grams"
                            value={manualGrams}
                            onChange={(e) => setManualGrams(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none"
                            required
                        />
                        <button 
                            type="submit"
                            className="absolute right-1 top-1 bottom-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 transition-colors flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                   </div>
              </form>
          </div>

          {/* Ingredients List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Current Ingredients
            </h3>
            
            {ingredients.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">List is empty.</p>
                <p className="text-slate-400 text-xs mt-1">Add custom ingredients above or scan products.</p>
              </div>
            ) : (
              ingredients.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-medium text-slate-800 truncate">{item.productName}</div>
                    <div className="text-xs text-slate-500">{item.calories100g} kcal/100g</div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button 
                        onClick={() => onUpdateIngredient(item.id, Math.max(0, item.amountGrams - 10))}
                        className="p-1.5 hover:bg-slate-100 text-slate-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input 
                        type="number" 
                        value={item.amountGrams}
                        onChange={(e) => onUpdateIngredient(item.id, Number(e.target.value))}
                        className="w-14 text-center text-sm font-medium focus:outline-none bg-transparent"
                      />
                      <div className="pr-2 text-xs text-slate-500">g</div>
                      <button 
                        onClick={() => onUpdateIngredient(item.id, item.amountGrams + 10)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="w-16 text-right font-bold text-indigo-600 text-sm sm:text-base">
                      {Math.round(item.calories100g * (item.amountGrams / 100))}
                    </div>

                    <button 
                      onClick={() => onRemoveIngredient(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          {ingredients.length > 0 && (
            <div className="bg-indigo-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-lg">
              <span className="font-medium opacity-90">Total Meal Calories</span>
              <span className="text-2xl font-bold">{Math.round(totalCalories)} kcal</span>
            </div>
          )}

          {/* Save Recipe Form */}
          {ingredients.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="font-semibold text-slate-700">Recipe Details</h3>
              <input
                type="text"
                placeholder="Recipe Name (e.g. My Healthy Breakfast)"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
              <textarea
                placeholder="Cooking instructions or notes..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={handleSave}
            disabled={ingredients.length === 0 || !recipeName.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
          >
            <Save className="w-5 h-5" />
            Save to Cookbook
          </button>
        </div>

      </div>
    </div>
  );
};

export default RecipeBuilderModal;