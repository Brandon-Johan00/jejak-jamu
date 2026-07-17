/**
 * TODO: sesuaikan key di sini persis sama dengan nama class di project
 * Teachable Machine kamu (case-sensitive). Value-nya harus match id
 * di data/plants.json.
 */
const CLASS_TO_PLANT_ID = {
  Kunyit: "kunyit",
  Jahe: "jahe",
  Temulawak: "temulawak",
};

// Prediksi di bawah confidence ini dianggap "tidak yakin"
export const CONFIDENCE_THRESHOLD = 0.6;

export function resolvePlantId(className) {
  return CLASS_TO_PLANT_ID[className] ?? null;
}