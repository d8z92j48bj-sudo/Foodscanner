/**
 * Ported logic from Python script to TypeScript.
 * Handles fallback generation for storage and expiration based on category keywords.
 */

export const generateStorageTip = (categoryInput: string): string => {
  const category = categoryInput.toLowerCase();

  // Python: if any(x in category for x in ["fruit", "vegetable", "produce", "groente"]):
  const produceKeywords = ["fruit", "vegetable", "produce", "groente"];
  if (produceKeywords.some(k => category.includes(k))) {
    return "Store in the fridge in an open container. Wash only before use.";
  }

  // Python: if any(x in category for x in ["meat", "vlees", "chicken", "beef"]):
  const meatKeywords = ["meat", "vlees", "chicken", "beef", "pork", "lamb"];
  if (meatKeywords.some(k => category.includes(k))) {
    return "Store in the fridge (0–4°C) and use within 1–2 days after opening.";
  }

  // Python: if any(x in category for x in ["fish", "vis", "seafood"]):
  const fishKeywords = ["fish", "vis", "seafood"];
  if (fishKeywords.some(k => category.includes(k))) {
    return "Store in the fridge (0–3°C) and use within 1 day after opening.";
  }

  // Python: if any(x in category for x in ["dairy", "zuivel", "cheese", "kaas", "yogurt", "milk"]):
  const dairyKeywords = ["dairy", "zuivel", "cheese", "kaas", "yogurt", "milk", "melk"];
  if (dairyKeywords.some(k => category.includes(k))) {
    return "Keep refrigerated (0–6°C) and use within a few days after opening.";
  }

  // Python: if any(x in category for x in ["chocolate", "chocolade"]):
  const chocolateKeywords = ["chocolate", "chocolade"];
  if (chocolateKeywords.some(k => category.includes(k))) {
    return "Store in a cool, dark place, do not refrigerate.";
  }

  // Python: if any(x in category for x in ["bread", "brood", "bakery"]):
  const breadKeywords = ["bread", "brood", "bakery", "bakkerij"];
  if (breadKeywords.some(k => category.includes(k))) {
    return "Store at room temperature in the bag. Freezing extends shelf life.";
  }

  // Default
  return "Store in a cool, dry place. Check packaging for exact instructions.";
};

export const generateExpirationOpened = (categoryInput: string): string => {
  const category = categoryInput.toLowerCase();

  const meatKeywords = ["meat", "vlees", "chicken"];
  if (meatKeywords.some(k => category.includes(k))) {
    return "1–2 days after opening in the fridge.";
  }

  const fishKeywords = ["fish", "vis"];
  if (fishKeywords.some(k => category.includes(k))) {
    return "1 day after opening in the fridge.";
  }

  const dairyKeywords = ["yogurt", "cheese", "kaas", "dairy", "zuivel"];
  if (dairyKeywords.some(k => category.includes(k))) {
    return "3–5 days after opening (refrigerated).";
  }

  const juiceKeywords = ["juice", "sap", "beverage", "drink"];
  if (juiceKeywords.some(k => category.includes(k))) {
    return "3–7 days after opening in the fridge.";
  }

  const sauceKeywords = ["sauce", "saus", "condiment"];
  if (sauceKeywords.some(k => category.includes(k))) {
    return "1–3 months after opening in the fridge.";
  }

  return "A few days after opening (refrigerated). Check packaging.";
};