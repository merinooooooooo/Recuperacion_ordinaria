// ============================================
// 🧾 PANTALLA PARA AGREGAR UN NUEVO REGISTRO
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { createEmployee } from '../api/employeesApi';

export default function CreateScreen({ navigation }) {
  // 🎯 Estados de los campos de entrada
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * 🧠 Maneja el envío del formulario.
   * Valida los datos y llama al endpoint de creación.
   */
  const handleSubmit = async () => {
    if (!name.trim() || !age.trim() || !job.trim() || !phone.trim()) {
      Alert.alert('Validación', 'Por favor, completa todos los campos.');
      return;
    }

    const payload = {
      Name: name.trim(),
      Age: Number(age),
      Job: job.trim(),
      Phone: phone.trim()
    };

    setLoading(true);
    try {
      await createEmployee(payload);
      Alert.alert('✅ Éxito', 'Registro creado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('❌ Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nuevo Registro</Text>

        {/* Campo: Nombre */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Carlos Hernández"
            placeholderTextColor="#A0A0A0"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Campo: Edad */}
        <View style={styles.field}>
          <Text style={styles.label}>Edad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: 25"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        {/* Campo: Puesto */}
        <View style={styles.field}>
          <Text style={styles.label}>Puesto de trabajo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Desarrollador"
            placeholderTextColor="#A0A0A0"
            value={job}
            onChangeText={setJob}
          />
        </View>

        {/* Campo: Teléfono */}
        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: 7777-8888"
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Botón de guardar */}
        <TouchableOpacity
          style={[styles.submit, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>💾 Guardar Registro</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================
// 🎨 ESTILOS MODERNOS Y LIMPIOS
// ============================================

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f5f9', // Fondo gris claro
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 30,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  submit: {
    backgroundColor: '#2563eb', // Azul brillante
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});