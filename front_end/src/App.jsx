import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { checkAuthStatus } from "./store/slices/authSlice";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
// import AdminLayout from "./layouts/AdminLayout";

// Guards
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/public/Home";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Leads from "./pages/admin/Leads";
import BlogsList from "./pages/admin/BlogsList";
import BlogEditor from "./pages/admin/BlogEditor";
import AdminLayout from "./layouts/AdminLayout";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import ServiceDetail from "./pages/public/ServiceDetail";
import Contact from "./pages/public/Contact";
import Blogs from "./pages/public/Blogs";
import BlogDetail from "./pages/public/BlogDetail";

function App() {
  const dispatch = useDispatch();

  // Page reload par session verify karna taaki admin logout na ho
  useEffect(() => {
    dispatch(checkAuthStatus()).unwrap().catch(() => {
      // Backend unreachable ya logged-out hone par silent handle
    });
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC CLIENT PORTAL */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:slug" element={<BlogDetail />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="blogs" element={<BlogsList />} />
            <Route path="blogs/new" element={<BlogEditor />} />
            <Route path="blogs/:id/edit" element={<BlogEditor />} />
          </Route>
        </Route>

        {/* FALLBACK (Unknown URLs ko Home par redirect karega) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
