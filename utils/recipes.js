import recipes from "../data/recipes.json";

/**
 * Ambil semua resep untuk satu tanaman tertentu.
 * Nanti kalau pindah ke Firestore, cukup ganti isi fungsi ini
 * jadi query Firestore — pemanggilnya (komponen) tidak perlu berubah.
 */
export function getRecipesByPlantId(plantId) {
  return recipes.filter((recipe) => recipe.plantId === plantId);
}

export function getRecipeById(recipeId) {
  return recipes.find((recipe) => recipe.id === recipeId) ?? null;
}

export function getAllRecipes() {
  return recipes;
}
