import React from 'react';

import HomeScreen from './src/homeScreen';

import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
};

export default App;
