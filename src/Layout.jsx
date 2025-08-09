import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Footer from "./Components/Footer/Footer";
import TopBar from "./Components/TopBar/TopBar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
          <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}