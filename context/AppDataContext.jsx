import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Context global sederhana untuk data yang perlu dibagi antar halaman:
 * - resep yang disimpan user (saved recipes)
 * - tanaman/bahan jamu yang sudah "ditemukan" user (botanical dictionary)
 *
 * CATATAN: state ini hanya tersimpan selama aplikasi berjalan (in-memory).
 * Project ini belum memasang @react-native-async-storage/async-storage,
 * jadi datanya akan reset saat aplikasi ditutup/dimuat ulang. Kalau nanti
 * ingin datanya benar-benar persisten di device, tinggal ganti isi
 * `setSavedRecipeIds`/`setDiscoveredIds` di bawah untuk baca-tulis ke
 * AsyncStorage setelah dependency-nya ditambahkan ke package.json.
 */

const AppDataContext = createContext(null);

// Beberapa tanaman "featured" di Home dianggap sudah dikenal dari awal,
// sisanya baru terbuka begitu user membuka profil tanaman tsb (mis. lewat Scan).
const INITIAL_DISCOVERED_IDS = ['kunyit', 'jahe', 'serai', 'kencur'];

export function AppDataProvider({ children }) {
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [discoveredIds, setDiscoveredIds] = useState(INITIAL_DISCOVERED_IDS);

  const isRecipeSaved = useCallback(
    (recipeId) => savedRecipeIds.includes(recipeId),
    [savedRecipeIds]
  );

  const toggleSavedRecipe = useCallback((recipeId) => {
    setSavedRecipeIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  }, []);

  const isDiscovered = useCallback(
    (ingredientId) => discoveredIds.includes(ingredientId),
    [discoveredIds]
  );

  const markDiscovered = useCallback((ingredientId) => {
    setDiscoveredIds((prev) => (prev.includes(ingredientId) ? prev : [...prev, ingredientId]));
  }, []);

  const value = useMemo(
    () => ({
      savedRecipeIds,
      isRecipeSaved,
      toggleSavedRecipe,
      discoveredIds,
      isDiscovered,
      markDiscovered,
    }),
    [savedRecipeIds, isRecipeSaved, toggleSavedRecipe, discoveredIds, isDiscovered, markDiscovered]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData harus dipakai di dalam <AppDataProvider>.');
  }
  return ctx;
}
