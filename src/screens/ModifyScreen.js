// ============================================
// ✏️ PANTALLA PARA EDITAR O ELIMINAR UN REGISTRO
// ============================================

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { getEmployeeById, updateEmployee, deleteEmployee, normalizeEmployee } from '../api/employeesApi.js';



export default function EditScreen({ route, navigation }) {
  const { id } = route.params;

  // 🎯 Estados locales para almacenar los datos del registro
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [phone, setPhone] = useState('');

  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🧠 Carga de datos iniciales del registro
  useEffect(() => {
    (async () => {
      try {
        const data = await getEmployeeById(id);
        const emp = normalizeEmployee(data);
        setName(emp.Name || '');
        setAge(typeof emp.Age === 'number' ? String(emp.Age) : '');
        setJob(emp.Job || '');
        setPhone(emp.Phone || '');
      } catch (e) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /**
   * 💾 Guarda los cambios realizados al registro.
   */
  const handleSave = async () => {
    if (!name.trim() || !age.trim() || !job.trim() || !phone.trim()) {
      Alert.alert('Validación', 'Por favor completa todos los campos.');
      return;
    }

    const payload = { 
      Name: name.trim(), 
      Age: Number(age), 
      Job: job.trim(), 
      Phone: phone.trim() 
    };

    setSaving(true);
    try {
      await updateEmployee(id, payload);
      Alert.alert('✅ Éxito', 'Registro actualizado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('❌ Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * 🗑️ Elimina el registro actual tras confirmación del usuario.
   */
  const handleDelete = async () => {
    Alert.alert('Confirmar', '¿Deseas eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEmployee(id);
            navigation.popToTop(); // Regresa al inicio
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  };

  // ⏳ Pantalla de carga inicial
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ color: '#2563eb', marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Registro</Text>

      {/* 🧾 Campos de entrada */}
      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: Ana Martínez"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: 28"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Puesto de trabajo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: Analista de datos"
          placeholderTextColor="#9ca3af"
          value={job}
          onChangeText={setJob}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: 7123-4567"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* 🔘 Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>💾 Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============================================
// 🎨 ESTILOS MODERNOS Y LIMPIOS
// ============================================

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9fafb', // Fondo claro
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d4ed8',
    textAlign: 'center',
    marginBottom: 30,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0f172a',
    fontSize: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 25,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});