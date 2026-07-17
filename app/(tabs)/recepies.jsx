import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from "react-native";

export default function Recipes() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes Page</Text>
      <Text style={styles.subtitle}>This is the recipes page of the app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    },
    subtitle: {
    fontSize: 16,
    textAlign: 'center',
    },
});