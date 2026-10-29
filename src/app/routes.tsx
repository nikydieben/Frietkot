import type { RouteObject } from 'react-router'
import { MenuPage } from '../features/menu/MenuPage'
import App from './App'
// STAP 3: haal de // weg op de volgende 2 regels
// import { SnackDetailPage } from '../features/menu/SnackDetailPage'
// import { CartPage } from '../features/cart/CartPage'

/** Alle pagina's van de app op één plek. */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MenuPage /> },
      // STAP 3: haal de // weg op de volgende 2 regels
      // { path: 'snack/:id', element: <SnackDetailPage /> },
      // { path: 'mandje', element: <CartPage /> },
    ],
  },
]
