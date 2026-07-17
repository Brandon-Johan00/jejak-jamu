import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ImageBackground, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const plantsData = [
  { id: '1', name: 'Kunyit', effect: 'Anti-inflamasi alami', image: 'https://images.alodokter.com/dk0z4ums3/image/upload/v1777014325/attached_image/kunyit.jpg' },
  { id: '2', name: 'Jahe Merah', effect: 'Meningkatkan imun', image: 'https://images.alodokter.com/dk0z4ums3/image/upload/v1777014325/attached_image/jahe.jpg' },
  { id: '3', name: 'Serai', effect: 'Detoksifikasi tubuh', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7jJtrATmBInjcz8ibeRFLD01L-OSlMjEeiWXIAbmIww&s' },
  { id: '4', name: 'Temulawak', effect: 'Kesehatan pencernaan', image: 'https://images.alodokter.com/dk0z4ums3/image/upload/v1777014325/attached_image/temulawak.jpg' },
];

const recipesData = [
  { id: '1', title: 'Beras Kencur Vitalitas', subtitle: 'Menghilangkan lelah & pegal linu', icon: 'lightning-bolt', bgColor: '#dcfce7', iconColor: '#16a34a' },
  { id: '2', title: 'Kunyit Asam Segar', subtitle: 'Detoks alami & mencerahkan kulit', icon: 'flower-tulip-outline', bgColor: '#ffedd5', iconColor: '#c2410c' },
  { id: '3', title: 'Teh Jahe Serai Tidur Nyenyak', subtitle: 'Menenangkan pikiran & menghangatkan', icon: 'moon-waning-crescent', bgColor: '#dcfce7', iconColor: '#16a34a' },
];

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* <TouchableOpacity>
              <Feather name="menu" size={24} color="#1f2937" />
            </TouchableOpacity> */}
            <Text style={styles.headerTitle}>Jejak Jamu</Text>
          </View>
          <TouchableOpacity>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>

        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80' }}
          style={styles.heroCardContainer}
          imageStyle={{ borderRadius: 32 }} 
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Temukan Rahasia Alam Indonesia.</Text>
            <Text style={styles.cardSubtitle}>
              Eksplorasi ribuan tahun tradisi jamu yang kini hadir untuk kesehatan modern Anda.
            </Text>
            
            <TouchableOpacity 
              style={styles.heroButton}
              onPress={() => router.push('/scan')}
            >
              <Feather name="maximize" size={18} color="#78350f" style={{ marginRight: 8 }} />
              <Text style={styles.heroButtonText}>Kenali Tanaman</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionLabel}>KOLEKSI TERPILIH</Text>
            <Text style={styles.sectionTitle}>Tanaman Unggulan</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
            <Feather name="arrow-right" size={16} color="#b45309" />
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {plantsData.map((plant) => (
            <TouchableOpacity key={plant.id} style={styles.gridItem}>
              <Image source={{ uri: plant.image }} style={styles.gridImage} />
              <Text style={styles.gridTitle}>{plant.name}</Text>
              <Text style={styles.gridSubtitle}>{plant.effect}</Text>
            </TouchableOpacity>
          ))}
        </View>

       
        <Text style={[styles.sectionTitle, styles.recipeTitle]}>Resep Jamu Populer</Text>
        
        <View style={styles.recipeList}>
          {recipesData.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeItem}>
              <View style={[styles.recipeIconContainer, { backgroundColor: recipe.bgColor }]}>
                <MaterialCommunityIcons name={recipe.icon} size={22} color={recipe.iconColor} />
              </View>
              
              <View style={styles.recipeTextContainer}>
                <Text style={styles.recipeItemTitle}>{recipe.title}</Text>
                <Text style={styles.recipeItemSubtitle}>{recipe.subtitle}</Text>
              </View>
              
              <Feather name="chevron-right" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b45309', 
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  heroCardContainer: {
    width: '100%',
    height: 380, 
    borderRadius: 32, 
    marginBottom: 32,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end', 
    padding: 24, 
    borderRadius: 32,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 34,
  },
  cardSubtitle: {
    color: '#f8fafc',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  heroButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#d97736',
    borderRadius: 9999, 
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start', 
  },
  heroButtonText: {
    color: '#78350f', 
    fontSize: 16,
    fontWeight: 'bold',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: '#b45309',
    fontWeight: '600',
    fontSize: 14,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', 
    marginBottom: 24,
  },
  gridImage: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },

  recipeTitle: {
    marginTop: 16,
    marginBottom: 20,
  },
  recipeList: {
    gap: 20, 
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  recipeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recipeTextContainer: {
    flex: 1,
  },
  recipeItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  recipeItemSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
});