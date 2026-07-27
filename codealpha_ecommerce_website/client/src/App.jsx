import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProductProvider } from './contexts/ProductContext';
import { ToastProvider } from './contexts/ToastContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { CompareProvider } from './contexts/CompareContext';
import { RewardPointsProvider } from './contexts/RewardPointsContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <WishlistProvider>
              <ProductProvider>
                <RecentlyViewedProvider>
                  <CompareProvider>
                    <RewardPointsProvider>
                      <ToastProvider>
                        <BrowserRouter>
                          <AppRoutes />
                        </BrowserRouter>
                      </ToastProvider>
                    </RewardPointsProvider>
                  </CompareProvider>
                </RecentlyViewedProvider>
              </ProductProvider>
            </WishlistProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
