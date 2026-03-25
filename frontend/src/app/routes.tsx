import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { POSPage } from './pages/POSPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { InventoryPage } from './pages/InventoryPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: () => <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'pos', Component: POSPage },
      { path: 'products', Component: ProductsPage },
      { path: 'products/new', Component: ProductFormPage },
      { path: 'products/:id/edit', Component: ProductFormPage },
      { path: 'inventory', Component: InventoryPage },
      { path: 'transactions', Component: TransactionsPage },
      { path: 'reports', Component: ReportsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
  {
    path: '*',
    Component: () => <Navigate to="/login" replace />,
  },
]);
