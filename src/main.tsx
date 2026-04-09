import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n.ts'
import 'bootstrap/dist/css/bootstrap.css'
import Header from './Components/Header/Header.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'

import List from './Pages/List/List.tsx'
import Home from './Pages/Home/Home.tsx'
import NotFound from './Pages/NotFound/NotFound.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <Home /> },
      { path: 'list', element: <List /> },
      { path: '*', element: <NotFound />}
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <RouterProvider router={router} />
  </StrictMode>,
)
