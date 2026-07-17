import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getRecipeById } from '../../utils/recipes';
import { useAppData } from '../../context/AppDataContext';

const DIFFICULTY_META = {
  Mudah: { color: '#2F5233' },
  Sedang: { color: '#C05D36' },
  Sulit: { color: '#B3261E' },
};

// Ganti {0001} dst di teks langkah dengan nama bahan yang sesuai.
function fillStepContent(content, ingredients) {
  return content.replace(/\{(\w+)\}/g, (match, id) => {
    const ingredient = ingredients.find((item) => item.id === id);
    return ingredient ? ingredient.name : match;
  });
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const recipe = getRecipeById(id);
  const { isRecipeSaved, toggleSavedRecipe } = useAppData();
  const saved = isRecipeSaved(id);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Resep tidak ditemukan.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const diffMeta = DIFFICULTY_META[recipe.difficulty] ?? DIFFICULTY_META.Mudah;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.imageWrapper}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={() => toggleSavedRecipe(recipe.id)}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#E85D75' : '#333'} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.description}>{recipe.description}</Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={15} color="#8E8E8E" />
              <Text style={styles.metaPillText}>{recipe.prepTimeMinutes} menit</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="flash-outline" size={15} color={diffMeta.color} />
              <Text style={[styles.metaPillText, { color: diffMeta.color }]}>{recipe.difficulty}</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="people-outline" size={15} color="#8E8E8E" />
              <Text style={styles.metaPillText}>{recipe.servings} porsi</Text>
            </View>
          </View>

          {/* Disease tags */}
          <View style={styles.tagRow}>
            {(recipe.diseases ?? []).map((disease) => (
              <View key={disease} style={styles.tag}>
                <Text style={styles.tagText}>{disease}</Text>
              </View>
            ))}
          </View>

          {/* Benefits */}
          <Text style={styles.sectionTitle}>Manfaat</Text>
          <View style={styles.benefitList}>
            {(recipe.benefits ?? []).map((benefit) => (
              <View key={benefit} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={16} color="#2F5233" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Ingredients */}
          <Text style={styles.sectionTitle}>Bahan-bahan</Text>
          <View style={styles.ingredientList}>
            {recipe.ingredients.map((ingredient) => (
              <View key={ingredient.id} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>
                  {ingredient.amount ? `${ingredient.amount}${ingredient.unit ?? ''} ` : ''}
                  {ingredient.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Steps */}
          <Text style={styles.sectionTitle}>Cara Membuat</Text>
          <View style={styles.stepList}>
            {recipe.steps.map((step, index) => (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepNumberCircle}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepContent}>
                    {fillStepContent(step.content, recipe.ingredients)}
                  </Text>
                  {step.timerSeconds && (
                    <View style={styles.timerBadge}>
                      <Ionicons name="alarm-outline" size={13} color="#C05D36" />
                      <Text style={styles.timerText}>
                        {Math.round(step.timerSeconds / 60)} menit
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
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
    paddingBottom: 60,
  },

  imageWrapper: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#F0F0F0',
  },
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
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#6B5D4F',
    lineHeight: 20,
    marginBottom: 16,
  },

  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4D6BF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E8E',
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#F6EEE0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C05D36',
    letterSpacing: 0.3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 4,
  },

  benefitList: {
    gap: 10,
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    color: '#4A4038',
    flex: 1,
  },

  ingredientList: {
    gap: 10,
    marginBottom: 24,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C05D36',
  },
  ingredientText: {
    fontSize: 13,
    color: '#4A4038',
    flex: 1,
  },

  stepList: {
    gap: 18,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2F5233',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stepContent: {
    fontSize: 13,
    color: '#6B5D4F',
    lineHeight: 19,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#F6EEE0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C05D36',
  },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  notFoundText: {
    fontSize: 15,
    color: '#666',
  },
  backLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C05D36',
  },
});
