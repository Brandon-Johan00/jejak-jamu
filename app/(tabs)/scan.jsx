import { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from 'expo-camera'; // Import kamera baru
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../theme/theme"; 
import { PlantClassifier } from "../../components/PlantClassifier";
import { resolvePlantId, CONFIDENCE_THRESHOLD } from "../../utils/identifyPlant";

export default function ScanScreen() {
  const router = useRouter();
  const classifierRef = useRef(null);
  const cameraRef = useRef(null); // Ref untuk live camera

  const [permission, requestPermission] = useCameraPermissions(); // Minta izin kamera

  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [statusText, setStatusText] = useState("Menyiapkan AI...");

  // Jika izin kamera masih loading
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Jika user menolak izin kamera
  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', marginBottom: 10 }}>Izinkan akses kamera untuk melanjutkan</Text>
        <Button onPress={requestPermission} title="Berikan Izin" />
      </View>
    );
  }

  // Fungsi 1: Ambil dari galeri (tetap pakai ImagePicker)
  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      processImage(result.assets[0]);
    }
  }

  // Fungsi 2: Jepret langsung dari live camera di layar
  async function takePicture() {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });
      processImage(photo);
    } catch (e) {
      console.warn("Gagal mengambil foto:", e);
    }
  }

  // Fungsi 3: Proses AI
  async function processImage(asset) {
    setImageUri(asset.uri);

    // Kalau AI WebView-nya belum siap/error, hentikan proses
    if (!modelReady) {
      alert("AI belum siap. Tunggu indikator berubah menjadi AI READY.");
      return;
    }

    setLoading(true);
    setStatusText("Menganalisa gambar...");

    try {
      // Teachable Machine via WebView membutuhkan prefix ini
      const base64Image = `data:image/jpeg;base64,${asset.base64}`;
      
      // Panggil fungsi classify dari ref PlantClassifier
      const predictions = await classifierRef.current?.classify(base64Image);

      if (!predictions || predictions.length === 0) {
        alert("Gagal mengidentifikasi. Coba foto lain.");
        return;
      }

      // Ambil hasil dengan persentase tertinggi
      const top = predictions[0];

      // Cek apakah persentasenya melebihi batas minimal (0.6 / 60%)
      if (top.probability < CONFIDENCE_THRESHOLD) {
        alert(`Kurang yakin (${Math.round(top.probability * 100)}%). Coba foto yang lebih jelas dari jarak dekat.`);
        return;
      }

      // Ubah nama class dari Teachable Machine menjadi ID plant
      const plantId = resolvePlantId(top.className);

      if (!plantId) {
        alert(`Terdeteksi "${top.className}" tapi belum ada di database. Cek pemetaan di utils/identifyPlant.js`);
        return;
      }

      // Pindah ke halaman detail menggunakan ID tersebut
      router.push(`/detail/${plantId}`);
      
    } catch (error) {
      console.error("Classification error:", error);
      alert("Terjadi kesalahan saat mengklasifikasi gambar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <PlantClassifier
        ref={classifierRef}
        onReady={() => {
          setModelReady(true);
          setStatusText("AI siap digunakan");
        }}
        onError={(message) => {
          setModelReady(false);
          setStatusText("AI belum di-setup"); 
        }}
      />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      ) : (
        <CameraView style={StyleSheet.absoluteFillObject} facing="back" ref={cameraRef} />
      )}

      <View style={styles.overlayContainer}>

        <View style={styles.topSection}>
          <View style={styles.aiBadge}>
            <View style={[styles.recordingDot, modelReady ? { backgroundColor: '#16A34A' } : {}]} />
            <Text style={styles.aiBadgeText}>
              {modelReady ? "AI READY" : "AI OFFLINE"}
            </Text>
          </View>
          <Text style={styles.cameraStats}>{statusText}</Text>
        </View>

        {loading && (
          <View style={styles.loadingCenter}>
            <ActivityIndicator color="#ffffff" size="large" />
            <Text style={styles.loadingText}>{statusText}</Text>
          </View>
        )}

        <View style={styles.bottomSection}>
          
          <Text style={styles.instructionTitle}>Point your camera</Text>
          <Text style={styles.instructionSubtitle}>Align the herb within the viewfinder</Text>

          <View style={styles.shutterRow}>
            
            <TouchableOpacity 
              style={styles.sideButton}
              onPress={pickFromGallery}
              disabled={loading}
            >
              <Ionicons name="image-outline" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.shutterButtonOuter, loading && { opacity: 0.5 }]}
              activeOpacity={0.7}
              onPress={takePicture}
              disabled={loading || !!imageUri} // <-- PERBAIKANNYA DI SINI
            >
              <View style={styles.shutterButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sideButton}
              onPress={() => setImageUri(null)}
              disabled={!imageUri}
            >
              <Ionicons name="trash-outline" size={24} color={imageUri ? "#fff" : "rgba(255,255,255,0.3)"} />
            </TouchableOpacity>

          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60, 
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'flex-start',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316', 
    marginRight: 8,
  },
  aiBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cameraStats: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginLeft: 4,
  },
  loadingCenter: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 40,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontWeight: '600',
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
  },
  instructionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  instructionSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
});