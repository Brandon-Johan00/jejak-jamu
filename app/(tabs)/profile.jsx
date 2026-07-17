import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../theme/theme";
import { useAppData } from '../../context/AppDataContext';
import { getAllIngredients } from '../../utils/ingredients';
import { getRecipeById } from '../../utils/recipes';

export default function ProfileScreen() {
  const router = useRouter();
  const { savedRecipeIds, toggleSavedRecipe, discoveredIds, isDiscovered } = useAppData();

  const allIngredients = useMemo(() => getAllIngredients(), []);

  const savedRecipes = useMemo(
    () => savedRecipeIds.map((id) => getRecipeById(id)).filter(Boolean),
    [savedRecipeIds]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.headerRow}>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.logoText}>Jejak Jamu</Text>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.headerAvatar}
          />
        </View>

        <View style={styles.pageTitleRow}>
          <Ionicons name="person-outline" size={20} color="#C05D36" />
          <Text style={styles.pageTitle}>Profile & Library</Text>
        </View>

        {/* --- Kartu Profil --- */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.mainAvatar}
            />
            <View style={styles.syncBadge}>
              <Ionicons name="sync-outline" size={14} color="#FFF" />
            </View>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.profileName}>Gede Arisanto</Text>
            <Ionicons name="pencil-outline" size={16} color="#8E8E8E" style={{ marginLeft: 5 }} />
          </View>
          <Text style={styles.profileLocation}>Sleman, D.I. Yogyakarta</Text>
        </View>


        <View style={styles.sectionHeader}>
          <Ionicons name="heart" size={18} color="#E85D75" />
          <Text style={styles.sectionTitle}>SAVED REMEDIES ({savedRecipes.length})</Text>
        </View>

        {savedRecipes.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>No saved recipes yet.</Text>
            <Text style={styles.emptyStateSub}>Tap the Heart icon on any recipe to save it for easy access.</Text>
          </View>
        ) : (
          <View style={styles.savedList}>
            {savedRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.savedCard}
                activeOpacity={0.85}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              >
                <Image source={{ uri: recipe.image }} style={styles.savedImage} />
                <View style={styles.savedInfo}>
                  <Text style={styles.savedTitle} numberOfLines={1}>{recipe.name}</Text>
                  <Text style={styles.savedSubtitle} numberOfLines={1}>{recipe.benefits?.[0]}</Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation?.();
                    toggleSavedRecipe(recipe.id);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="heart" size={20} color="#E85D75" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="book-outline" size={18} color="#C05D36" />
            <Text style={styles.sectionTitle}>BOTANICAL HERB DICTIONARY</Text>
          </View>
          <Text style={styles.discoveryText}>{discoveredIds.length} / {allIngredients.length} Discovered</Text>
        </View>

        {/* Grid Container */}
        <View style={styles.gridContainer}>
          {allIngredients.map((herb) => {
            const discovered = isDiscovered(herb.id);
            return (
              <TouchableOpacity
                key={herb.id}
                style={styles.herbCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/ingredient/${herb.id}`)}
              >
                <View style={styles.herbImageWrapper}>
                  <Image
                    source={{ uri: herb.image }}
                    style={[styles.herbImage, !discovered && styles.herbImageLocked]}
                  />
                  {!discovered && (
                    <View style={styles.lockOverlay}>
                      <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.herbInfo}>
                  <Text style={styles.herbName} numberOfLines={1}>
                    {discovered ? herb.name : '???'}
                  </Text>
                  <Text style={styles.herbSci} numberOfLines={1}>
                    {discovered ? herb.latinName : 'Belum ditemukan'}
                  </Text>
                  <Text style={styles.readProfileText}>
                    {discovered ? 'Read Profile' : 'Tap to Discover'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#C05D36',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  mainAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9C5B2',
  },
  syncBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#C05D36',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileLocation: {
    fontSize: 14,
    color: '#8E8E8E',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8E8E8E',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  discoveryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C05D36',
  },
  emptyStateCard: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  emptyStateSub: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },

  savedList: {
    gap: 10,
    marginBottom: 25,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 8,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  savedImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  savedInfo: {
    flex: 1,
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  savedSubtitle: {
    fontSize: 12,
    color: '#8E8E8E',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  herbCard: {
    backgroundColor: '#FFF',
    width: '48%',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  herbImageWrapper: {
    position: 'relative',
  },
  herbImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F0F0F0',
    resizeMode: 'cover',
  },
  herbImageLocked: {
    opacity: 0.35,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(60,60,60,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  herbInfo: {
    padding: 10,
  },
  herbName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  herbSci: {
    fontSize: 11,
    color: '#8E8E8E',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  readProfileText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C05D36',
  },
});
