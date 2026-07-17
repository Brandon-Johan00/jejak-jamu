import ingredients from "../data/ingredient.json";

/**
 * Ambil semua data tanaman/bahan jamu.
 */
export function getAllIngredients() {
  return ingredients;
}

/**
 * Ambil satu tanaman berdasarkan id-nya (mis. "kunyit").
 */
export function getIngredientById(ingredientId) {
  return ingredients.find((item) => item.id === ingredientId) ?? null;
}
