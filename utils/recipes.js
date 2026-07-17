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

/**
 * Daftar semua kategori penyakit/keluhan unik, terurut alfabetis.
 * Dipakai untuk membangun chip filter di halaman Resep.
 */
export function getAllDiseases() {
  const set = new Set();
  recipes.forEach((recipe) => {
    (recipe.diseases ?? []).forEach((disease) => set.add(disease));
  });
  return Array.from(set).sort();
}

/**
 * Filter resep berdasarkan kategori penyakit (opsional) dan kata kunci
 * pencarian (opsional, dicocokkan ke nama, deskripsi, dan benefit resep).
 */
export function searchRecipes({ disease = null, query = "" } = {}) {
  const q = query.trim().toLowerCase();

  return recipes.filter((recipe) => {
    const matchesDisease = !disease || (recipe.diseases ?? []).includes(disease);

    if (!q) return matchesDisease;

    const haystack = [
      recipe.name,
      recipe.description,
      ...(recipe.benefits ?? []),
      ...(recipe.diseases ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return matchesDisease && haystack.includes(q);
  });
}