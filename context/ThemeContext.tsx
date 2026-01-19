import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  lowBandwidth: boolean;
  toggleLowBandwidth: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lowBandwidth, setLowBandwidth] = useState(false);

  // Check if user has a preference stored or detects slow connection (optional advanced feature)
  useEffect(() => {
    const savedMode = localStorage.getItem('architech-low-bandwidth');
    if (savedMode === 'true') setLowBandwidth(true);
  }, []);

  const toggleLowBandwidth = () => {
    setLowBandwidth(prev => {
      const newValue = !prev;
      localStorage.setItem('architech-low-bandwidth', String(newValue));
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ lowBandwidth, toggleLowBandwidth }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};