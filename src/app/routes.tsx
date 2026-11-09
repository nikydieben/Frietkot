import type { RouteObject } from 'react-router'
import { AdminPage } from '../features/admin/AdminPage'
import { CartPage } from '../features/cart/CartPage'
import { OrderPage } from '../features/cart/OrderPage'
import { MenuPage } from '../features/menu/MenuPage'
import { SnackDetailPage } from '../features/menu/SnackDetailPage'
import App from './App'

/*
  DEMO BUNDLING

  1. npm run build en noteer de grootte van de bundle in dist/assets.
     Wie raadt hoeveel kleiner hij wordt als de admin lazy is?
  2. Maak /admin lazy: vervang de import hierboven door een `lazy`-route,
     zodat de admin-code pas geladen wordt als iemand /admin opent.
  3. Opnieuw bouwen: de admin zit nu in een aparte chunk.
*/
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MenuPage /> },
      { path: 'snack/:id', element: <SnackDetailPage /> },
      { path: 'mandje', element: <CartPage /> },
      { path: 'bestelling/:nummer', element: <OrderPage /> },
      { path: 'admin', element: <AdminPage /> },
    ],
  },
]
