import type { RouteObject } from 'react-router'
import { CartPage } from '../features/cart/CartPage'
import { OrderPage } from '../features/cart/OrderPage'
import { MenuPage } from '../features/menu/MenuPage'
import { SnackDetailPage } from '../features/menu/SnackDetailPage'
import App from './App'

/** Alle pagina's van de app op één plek. */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MenuPage /> },
      { path: 'snack/:id', element: <SnackDetailPage /> },
      { path: 'mandje', element: <CartPage /> },
      { path: 'bestelling/:nummer', element: <OrderPage /> },
    ],
  },
]
