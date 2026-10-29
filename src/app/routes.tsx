import type { RouteObject } from 'react-router'
import { CartPage } from '../features/cart/CartPage'
import { MenuPage } from '../features/menu/MenuPage'
import { SnackDetailPage } from '../features/menu/SnackDetailPage'
import App from './App'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    hydrateFallbackElement: <p className="state state--loading">Laden…</p>,
    children: [
      { index: true, element: <MenuPage /> },
      { path: 'snack/:id', element: <SnackDetailPage /> },
      { path: 'mandje', element: <CartPage /> },
      {
        path: 'admin',
        // Lazy: de admin-code zit in een aparte chunk en laadt pas wie /admin opent.
        lazy: async () => ({ Component: (await import('../features/admin/AdminPage')).AdminPage }),
      },
    ],
  },
]
