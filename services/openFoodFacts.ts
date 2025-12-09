import { ProductData } from '../types';
import { generateStorageTip, generateExpirationOpened } from './productLogic';

const API_BASE = "https://world.openfoodfacts.org/api/v0/product";

export const fetchProductByBarcode = async (barcode: string): Promise<ProductData> => {
  try {
    const response = await fetch(`${API_BASE}/${barcode}.json`, {
      headers: {
        'User-Agent': 'SmartPantryReact/1.0 (demo@example.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 0) {
      throw new Error("Product not found");
    }

    const p = data.product;

    // Construct category string for logic
    const catStr = p.categories || "";
    const catTags = (p.categories_tags || []).join(" ");
    const fullCategoryString = `${catStr} ${catTags}`;

    // Apply logic (Local or API provided)
    const storageTip = p.conservation_conditions || generateStorageTip(fullCategoryString);
    const expirationOpened = generateExpirationOpened(fullCategoryString);
    const expirationClosed = p.expiration_date || "No date known, see packaging.";
    
    // Extract calories
    const nutriments = p.nutriments || {};
    let calories = nutriments["energy-kcal_100g"];
    if (calories === undefined || calories === null) {
      calories = nutriments["energy-kcal"];
    }

    return {
      barcode,
      name: p.product_name || "Unknown Product",
      brand: p.brands || "Unknown Brand",
      imageUrl: p.image_front_url || p.image_url,
      calories100g: calories !== undefined ? Math.round(Number(calories)) : "N/A",
      storageTip,
      expirationOpened,
      expirationClosed,
      categories: fullCategoryString,
      ingredientsText: p.ingredients_text
    };

  } catch (error: any) {
    console.error("Fetch error:", error);
    throw error;
  }
};