import React, { useState } from 'react';
import { SavedRecipe, CustomRecipe } from '../types';
import { X, ChefHat, Flame, Trash2, Calendar, Utensils, LayoutList } from 'lucide-react';

interface SavedRecipesModalProps {
  recipes: SavedRecipe[];
  customRecipes: CustomRecipe[];
  onClose: () => void;
  onDeleteRecipe: (id: string) => void;
  onDeleteCustomRecipe: (id: string) => void;
}

const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({ 
  recipes, 
  customRecipes, 
  onClose, 
  onDeleteRecipe, 
  onDeleteCustomRecipe 
}) => {
  const [activeTab, setActiveTab] = useState<'ideas' | 'meals'>('meals');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        ></div>

        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                        <ChefHat className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">My Cookbook</h2>
                        <p className="text-sm text-slate-500">
                          {recipes.length} ideas • {customRecipes.length} meals
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('meals')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${
                  activeTab === 'meals' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Utensils className="w-4 h-4" /> Custom Meals
                {activeTab === 'meals' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('ideas')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${
                  activeTab === 'ideas' ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <LayoutList className="w-4 h-4" /> Product Ideas
                {activeTab === 'ideas' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>}
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                
                {activeTab === 'meals' && (
                  <>
                    {customRecipes.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                          <Utensils className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p>No custom meals yet.</p>
                          <p className="text-sm mt-1">Use the "Meal Calculator" to build one.</p>
                      </div>
                    ) : (
                      customRecipes.map((meal) => (
                          <div key={meal.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-bold text-lg text-slate-800">{meal.name}</h3>
                                  <button 
                                      onClick={() => onDeleteCustomRecipe(meal.id)}
                                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                      title="Delete meal"
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                              
                              <p className="text-sm text-slate-600 mb-3 whitespace-pre-wrap">{meal.instructions}</p>

                              <div className="bg-indigo-50 rounded-lg p-3 text-sm space-y-2 mb-3">
                                <div className="font-semibold text-indigo-900 text-xs uppercase tracking-wide">Ingredients</div>
                                {meal.ingredients.map((ing, i) => (
                                  <div key={i} className="flex justify-between text-indigo-800">
                                    <span>{ing.productName}</span>
                                    <span className="opacity-70">{ing.amountGrams}g</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                  <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2 py-1 rounded-md font-bold">
                                      <Flame className="w-3.5 h-3.5" />
                                      <span>{Math.round(meal.totalCalories)} kcal Total</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                      <Calendar className="w-3.5 h-3.5" />
                                      <span>{new Date(meal.dateCreated).toLocaleDateString()}</span>
                                  </div>
                              </div>
                          </div>
                      ))
                    )}
                  </>
                )}

                {activeTab === 'ideas' && (
                  <>
                    {recipes.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No saved ideas yet.</p>
                            <p className="text-sm mt-1">Scan a product and save an AI idea.</p>
                        </div>
                    ) : (
                        recipes.map((recipe) => (
                            <div key={recipe.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg text-slate-800">{recipe.product.name}</h3>
                                    <button 
                                        onClick={() => onDeleteRecipe(recipe.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                        title="Delete recipe"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="bg-emerald-50 p-4 rounded-lg mb-4 border border-emerald-100/50">
                                    <p className="text-emerald-900 font-medium italic">"{recipe.aiData.recipeIdea}"</p>
                                </div>

                                <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                                    <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2 py-1 rounded-md">
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>{recipe.product.calories100g} kcal/100g</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Saved: {new Date(recipe.dateSaved).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                  </>
                )}
            </div>
        </div>
    </div>
  );
};

export default SavedRecipesModal;