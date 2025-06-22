import React from 'react';
import AppRouter from './router';
import { ThemeProvider } from './context/ThemeContext';
import { ShoppingProvider } from './context/ShoppingContext';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <ShoppingProvider>
            <AppRouter />
            <Toaster />
          </ShoppingProvider>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
