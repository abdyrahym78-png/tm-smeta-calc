import React from 'react';
import { CurrencyConverter } from './components/CurrencyConverter';

export const App: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px 0' }}>
      <CurrencyConverter />
    </div>
  );
};

export default App;
