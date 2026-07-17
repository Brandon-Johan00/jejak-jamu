import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/theme';

export default function PlantDetailScreen() {
  const router = useRouter();
  
  // Mengambil parameter ID dari URL (misal: "kunyit", "jahe")
  const { id } = useLocalSearchParams(); 

  return (
    <View style={styles.container}>
      {/* Tombol Back */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.background} />
      </TouchableOpacity>

      <Text style={styles.title}>Detail Tanaman</Text>
      <Text style={styles.subtitle}>ID yang terdeteksi: {id}</Text>
      
      {/* Nanti kamu bisa import data/plants.json di sini dan mencocokkan datanya menggunakan variabel 'id' */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#16A34A', // Warna hijau
  }
});