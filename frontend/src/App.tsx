import React from 'react';
import AppRouter from './router';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ShoppingProvider } from "./context/ShoppingContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminNotificationProvider } from "./context/AdminNotificationContext";
import Chatbot from "./components/Chatbot/Chatbot";
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ui/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AdminNotificationProvider>
                <ShoppingProvider>
                  <AppRouter />
                  <Chatbot />
                </ShoppingProvider>
              </AdminNotificationProvider>
            </AuthProvider>
            <Toaster />
          </QueryClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
