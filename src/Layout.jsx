import { Outlet } from 'react-router-dom';
import Footer from "./Components/Footer/Footer";
import TopBar from "./Components/TopBar/TopBar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar />
      <main className="flex-grow container mx-auto ">
          <Outlet />
      </main>
      <Footer />
    </div>
  );
}