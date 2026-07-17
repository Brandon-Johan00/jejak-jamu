import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from "react";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";

// TODO: ganti dengan link "Upload (shareable link)" dari Teachable Machine kamu.
// Harus diakhiri tanda "/" — contoh: https://teachablemachine.withgoogle.com/models/AbCdEfGh1/
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/REPLACE_ME/";

const classifierHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script>
  </head>
  <body>
    <script>
      const MODEL_URL = "https://teachablemachine.withgoogle.com/models/6WCSEZfyl/";
      let model = null;

      function post(payload) {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }

      async function loadModel() {
        try {
          model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
          post({ type: "ready" });
        } catch (err) {
          post({ type: "error", message: "Gagal load model: " + String(err) });
        }
      }

      function classify(base64Image) {
        const img = new Image();
        img.onload = async () => {
          try {
            const predictions = await model.predict(img);
            predictions.sort((a, b) => b.probability - a.probability);
            post({ type: "result", predictions: predictions });
          } catch (err) {
            post({ type: "error", message: "Gagal klasifikasi: " + String(err) });
          }
        };
        img.onerror = () => post({ type: "error", message: "Gagal load gambar" });
        img.src = base64Image;
      }

      function handleMessage(raw) {
        try {
          const msg = JSON.parse(raw);
          if (msg.type === "classify") classify(msg.image);
        } catch (err) {
          post({ type: "error", message: String(err) });
        }
      }

      document.addEventListener("message", function (e) { handleMessage(e.data); });
      window.addEventListener("message", function (e) { handleMessage(e.data); });

      loadModel();
    </script>
  </body>
</html>
`;

/**
 * Komponen tak terlihat yang menjalankan model Teachable Machine di
 * dalam WebView. Panggil lewat ref:
 *
 *   const classifierRef = useRef(null);
 *   <PlantClassifier ref={classifierRef} onReady={...} onError={...} />
 *   const predictions = await classifierRef.current.classify(base64DataUri);
 */
export const PlantClassifier = forwardRef(function PlantClassifier(
  { onReady, onError },
  ref
) {
  const webviewRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const pendingResolve = useRef(null);

  const handleMessage = useCallback(
    (event) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === "ready") {
          setIsReady(true);
          onReady?.();
        } else if (msg.type === "result") {
          pendingResolve.current?.(msg.predictions);
          pendingResolve.current = null;
        } else if (msg.type === "error") {
          onError?.(msg.message);
          pendingResolve.current?.(null);
          pendingResolve.current = null;
        }
      } catch (err) {
        onError?.(String(err));
      }
    },
    [onReady, onError]
  );

  useImperativeHandle(ref, () => ({
    isReady: () => isReady,
    classify: (base64Image) =>
      new Promise((resolve) => {
        pendingResolve.current = resolve;
        webviewRef.current?.postMessage(
          JSON.stringify({ type: "classify", image: base64Image })
        );
      }),
  }));

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={["*"]}
      source={{ html: classifierHtml }}
      onMessage={handleMessage}
      style={styles.hidden}
      javaScriptEnabled
      domStorageEnabled
    />
  );
});

const styles = StyleSheet.create({
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});
