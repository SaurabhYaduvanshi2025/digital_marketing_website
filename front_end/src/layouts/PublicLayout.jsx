// src/layouts/PublicLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <Header />

      {/* Dynamic Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}