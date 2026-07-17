import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { getAllDiseases, searchRecipes } from '../../utils/recipes';

const DIFFICULTY_META = {
  Mudah: { icon: 'flash-outline', color: '#2F5233' },
  Sedang: { icon: 'flash-outline', color: '#C05D36' },
  Sulit: { icon: 'flash-outline', color: '#B3261E' },
};

export default function RecipesScreen() {
  const router = useRouter();
  const diseases = useMemo(() => getAllDiseases(), []);
  const [activeDisease, setActiveDisease] = useState(null);
  const [query, setQuery] = useState('');

  const recipes = useMemo(
    () => searchRecipes({ disease: activeDisease, query }),
    [activeDisease, query]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.pageTitleRow}>
          <Ionicons name="book-outline" size={20} color="#C05D36" />
          <Text style={styles.pageTitle}>Resep Jamu</Text>
        </View>
        <Text style={styles.pageSubtitle}>
          Ramuan tradisional Indonesia untuk menjaga kesehatan sehari-hari.
        </Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#8E8E8E" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari resep, bahan, atau khasiat..."
            placeholderTextColor="#A9A198"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#C4B8A6" />
            </TouchableOpacity>
          )}
        </View>

        {/* Disease filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <TouchableOpacity
            style={[styles.chip, !activeDisease && styles.chipActive]}
            onPress={() => setActiveDisease(null)}
          >
            <Text style={[styles.chipText, !activeDisease && styles.chipTextActive]}>
              Semua
            </Text>
          </TouchableOpacity>

          {diseases.map((disease) => {
            const active = activeDisease === disease;
            return (
              <TouchableOpacity
                key={disease}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveDisease(active ? null : disease)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {disease}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results */}
        <Text style={styles.resultCount}>
          {recipes.length} resep ditemukan
        </Text>

        <View style={styles.list}>
          {recipes.map((recipe) => {
            const diffMeta = DIFFICULTY_META[recipe.difficulty] ?? DIFFICULTY_META.Mudah;
            return (
              <TouchableOpacity
                key={recipe.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              >
                <Image source={{ uri: recipe.image }} style={styles.cardImage} />

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{recipe.name}</Text>
                  <Text style={styles.cardBenefit} numberOfLines={2}>
                    {recipe.benefits?.[0]}
                  </Text>

                  <View style={styles.cardMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color="#8E8E8E" />
                      <Text style={styles.metaText}>{recipe.prepTimeMinutes} menit</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name={diffMeta.icon} size={14} color={diffMeta.color} />
                      <Text style={[styles.metaText, { color: diffMeta.color }]}>
                        {recipe.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#C4B8A6" />
              </TouchableOpacity>
            );
          })}

          {recipes.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={28} color="#C4B8A6" />
              <Text style={styles.emptyStateTitle}>Resep tidak ditemukan</Text>
              <Text style={styles.emptyStateSub}>
                Coba kata kunci lain atau pilih kategori berbeda.
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },

  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#8E8E8E',
    marginBottom: 18,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4D6BF',
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },

  chipRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4D6BF',
  },
  chipActive: {
    backgroundColor: '#C05D36',
    borderColor: '#C05D36',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B5D4F',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  resultCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8E8E8E',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  list: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  cardBenefit: {
    fontSize: 12,
    color: '#8E8E8E',
    marginBottom: 8,
    lineHeight: 16,
  },
  cardMetaRow: {
    flexDirection: 'row',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E8E',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
    marginBottom: 4,
  },
  emptyStateSub: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
