import { useState } from 'react';
import { FaBars, FaTimes, FaUser, FaBell } from 'react-icons/fa';

export default function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-royal-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight">MRO</h1>
          </div>
          
          {/* Navigation Desktop */}
          
          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Connexion
            </button>
          </div>
          
          {/* Menu Mobile Button */}
          <button 
            className="md:hidden text-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-royal-blue-700">
            <ul className="flex flex-col space-y-4">
              <li>
                <a 
                  href="/" 
                  className="block py-2 font-medium hover:text-royal-blue-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </a>
              </li>
              <li className="pt-4 flex space-x-4">
                <button className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full">
                  Connexion
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
