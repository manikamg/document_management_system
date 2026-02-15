import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './routes/PublicRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { routes } from './routes/Index.jsx';
import MainLayout from "./layouts/MainLayout.jsx"
const Login = lazy(() => import('./pages/auth/Login.jsx'))


const App = () => {

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Login />
            </Suspense>
          </PublicRoute>
        }
      />
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {
          routes.map((route) => (
            <Route path={route.path} index={route.index} element={route.element} />
          ))
        }
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
