import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar las pantallas renombradas
import ListScreen from '../screens/ListScreen';
import AddScreen from '../screens/AddScreen';
import ModifyScreen from '../screens/ModifyScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e293b' },
        headerTintColor: '#f8fafc',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{ title: 'Personal del Taller' }}
      />
      <Stack.Screen
        name="Add"
        component={AddScreen}
        options={{ title: 'Registrar Personal' }}
      />
      <Stack.Screen
        name="Modify"
        component={ModifyScreen}
        options={{ title: 'Editar Datos' }}
      />
    </Stack.Navigator>
  );
}