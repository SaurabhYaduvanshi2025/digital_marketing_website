// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const location = useLocation();
  // Redux store se state extract karna
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Agar page refresh ho raha hai aur backend status check kar raha hai, to blank white screen ki jagah loader dikhega
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-xs uppercase tracking-wider text-slate-400">Authenticating Session...</span>
        </div>
      </div>
    );
  }

  // Agar logged in hai toh child route (Dashboard, Leads, etc.) khulega, warna /admin/login par bhej dega
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/admin/login" replace state={{ from: location }} />;
}
