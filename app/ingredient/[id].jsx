import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getIngredientById } from '../../utils/ingredients';
import { getRecipesByPlantId } from '../../utils/recipes';
import { useAppData } from '../../context/AppDataContext';

const BENEFIT_COLORS = {
  green: { bg: '#DCFCE7', icon: '#16A34A' },
  red: { bg: '#FEE2E2', icon: '#DC2626' },
  orange: { bg: '#FFEDD5', icon: '#C2410C' },
  blue: { bg: '#DBEAFE', icon: '#2563EB' },
  purple: { bg: '#EDE9FE', icon: '#7C3AED' },
  teal: { bg: '#CCFBF1', icon: '#0D9488' },
};

const DIFFICULTY_META = {
  Mudah: { color: '#2F5233' },
  Sedang: { color: '#C05D36' },
  Sulit: { color: '#B3261E' },
};

export default function IngredientProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const { markDiscovered } = useAppData();

  const ingredient = getIngredientById(id);
  const relatedRecipes = ingredient ? getRecipesByPlantId(ingredient.id) : [];

  useEffect(() => {
    if (ingredient) {
      markDiscovered(ingredient.id);
    }
  }, [ingredient, markDiscovered]);

  if (!ingredient) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Tanaman tidak ditemukan.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.imageWrapper}>
          <Image source={{ uri: ingredient.image }} style={styles.image} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {ingredient.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={13} color="#2F5233" />
              <Text style={styles.verifiedText}>Heritage Verified</Text>
            </View>
          )}

          <Text style={styles.title}>
            {ingredient.name}{ingredient.englishName ? ` (${ingredient.englishName})` : ''}
          </Text>
          <Text style={styles.latinName}>{ingredient.latinName}</Text>

          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="medical" size={16} color="#C05D36" />
            </View>
            <Text style={styles.sectionTitle}>Health Benefits</Text>
          </View>

          <View style={styles.spotlightCard}>
            <View style={styles.tagRow}>
              {(ingredient.tags ?? []).map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagPillText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.spotlightTitle}>{ingredient.spotlightTitle}</Text>
            <Text style={styles.spotlightText}>{ingredient.spotlightText}</Text>
          </View>

          {(ingredient.benefits ?? []).map((benefit) => {
            const palette = BENEFIT_COLORS[benefit.color] ?? BENEFIT_COLORS.green;
            return (
              <View key={benefit.title} style={[styles.benefitCard, { backgroundColor: palette.bg }]}>
                <Ionicons name={benefit.icon} size={20} color={palette.icon} />
                <View style={styles.benefitTextContainer}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
              </View>
            );
          })}

          <View style={[styles.sectionTitleRow, { marginTop: 24 }]}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="flask" size={16} color="#C05D36" />
            </View>
            <Text style={styles.sectionTitle}>Proper Dosage</Text>
          </View>
          <View style={styles.dosageCard}>
            <Ionicons name="information-circle-outline" size={18} color="#8E8E8E" />
            <Text style={styles.dosageText}>{ingredient.dosage}</Text>
          </View>

          <View style={styles.recipesHeaderRow}>
            <Text style={[styles.sectionTitle, { marginLeft: 0 }]}>Recommended{'\n'}Recipes</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/recipes')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {relatedRecipes.length === 0 ? (
            <Text style={styles.noRecipesText}>Belum ada resep untuk tanaman ini.</Text>
          ) : (
            <View style={styles.recipeList}>
              {relatedRecipes.map((recipe) => {
                const diffMeta = DIFFICULTY_META[recipe.difficulty] ?? DIFFICULTY_META.Mudah;
                return (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.recipeCard}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/recipe/${recipe.id}`)}
                  >
                    <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeName} numberOfLines={1}>{recipe.name}</Text>
                      <Text style={styles.recipeMeta} numberOfLines={1}>
                        <Text style={{ color: diffMeta.color }}>{recipe.difficulty}</Text>
                        {'  ·  '}{recipe.prepTimeMinutes} menit
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#C4B8A6" />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowMore(!showMore)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownText}>
              {showMore ? 'See Less' : 'See More (Traditions & Science)'}
            </Text>
            <Ionicons name={showMore ? 'chevron-up' : 'chevron-down'} size={20} color="#6B5D4F" />
          </TouchableOpacity>

          {showMore && (
            <View style={styles.extraInfo}>
              <Text style={styles.extraSectionTitle}>Cultural Tradition</Text>
              <Text style={styles.detailedText}>{ingredient.traditions}</Text>

              <Text style={styles.extraSectionTitle}>Scientific Facts</Text>
              <Text style={styles.detailedText}>{ingredient.science}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDFBF7' },
  container: { flex: 1 },

  imageWrapper: { position: 'relative' },
  image: { width: '100%', height: 260, backgroundColor: '#F0F0F0', resizeMode: 'cover' },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: { padding: 20 },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 5,
    marginBottom: 14,
  },
  verifiedText: { fontSize: 11, fontWeight: '700', color: '#2F5233' },

  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 4, lineHeight: 32 },
  latinName: { fontSize: 15, fontStyle: 'italic', color: '#8E8E8E', marginBottom: 24 },

  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  sectionIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F6EEE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: '#333' },

  spotlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0E6D2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  tagPill: {
    backgroundColor: '#FFEDD5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagPillText: { fontSize: 11, fontWeight: '700', color: '#C2410C' },
  spotlightTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  spotlightText: { fontSize: 13, color: '#4F46E5', lineHeight: 19 },

  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  benefitTextContainer: { flex: 1 },
  benefitTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  benefitText: { fontSize: 12.5, color: '#5A5147', lineHeight: 18 },

  dosageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4D6BF',
    padding: 14,
    marginBottom: 8,
  },
  dosageText: { flex: 1, fontSize: 13, color: '#4A4038', lineHeight: 19 },

  recipesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 24,
    marginBottom: 14,
  },
  viewAllButton: { paddingTop: 4 },
  viewAllText: { fontSize: 13, fontWeight: '700', color: '#C05D36' },
  noRecipesText: { fontSize: 13, color: '#8E8E8E', marginBottom: 10 },

  recipeList: { gap: 10, marginBottom: 8 },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  recipeImage: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#F0F0F0' },
  recipeInfo: { flex: 1 },
  recipeName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 3 },
  recipeMeta: { fontSize: 12, color: '#8E8E8E' },

  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6EEE0',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  dropdownText: { fontSize: 14, fontWeight: '600', color: '#4A4038' },
  extraInfo: { marginTop: 15, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12 },
  extraSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 6, marginTop: 10 },
  detailedText: { fontSize: 13, color: '#5A5147', lineHeight: 20, marginBottom: 6 },

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  notFoundText: { fontSize: 15, color: '#666' },
  backLink: { fontSize: 14, fontWeight: 'bold', color: '#C05D36' },
});
