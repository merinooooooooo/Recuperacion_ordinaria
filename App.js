import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from '../recuperacion/src/navigation/MainNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
}