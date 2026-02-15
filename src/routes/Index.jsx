import Login from "../pages/auth/Login";
// Protected routes components
import Dashboard from "../pages/dashboard/Index";



export const routes = [
    { path: "/dashboard", index: false, element: <Dashboard />  }
]