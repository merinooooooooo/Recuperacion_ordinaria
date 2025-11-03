// ============================================
// 🧾 LIST SCREEN - LISTADO DE EMPLEADOS
// ============================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { getEmployees, deleteEmployee, normalizeEmployee, filterEmployeesByName } from '../api/employeesApi';

export default function ListScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // ✅ Cargar todos los empleados
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data.map(normalizeEmployee));
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔄 Refrescar lista
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEmployees();
    setRefreshing(false);
  }, [loadEmployees]);

  // 🔍 Filtrar empleados por nombre
  const handleSearch = async (text) => {
    setSearch(text);
    try {
      const filtered = await filterEmployeesByName(text);
      setEmployees(filtered.map(normalizeEmployee));
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  // ❌ Eliminar empleado
  const handleDelete = (id) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este empleado?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await deleteEmployee(id);
            setEmployees((prev) => prev.filter(e => e.id !== id));
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        } 
      }
    ]);
  };

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre..."
        value={search}
        onChangeText={handleSearch}
      />

      {/* Lista de empleados */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.Name}</Text>
              <Text>Edad: {item.Age}</Text>
              <Text>Puesto: {item.Job}</Text>
              <Text>Teléfono: {item.Phone}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('Modify', { id: item.id })}>
              <Text style={styles.editText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Botón para crear nuevo empleado */}
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('Add')}>
        <Text style={styles.addText}>➕ Nuevo Empleado</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================
// 🎨 ESTILOS
// ============================================

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f5f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center'
  },
  name: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  editBtn: { padding: 8 },
  editText: { color: '#2563eb', fontSize: 20, marginRight: 4 },
  deleteBtn: { padding: 8 },
  deleteText: { color: '#ef4444', fontSize: 20 },
  addBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  addText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});