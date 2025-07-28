import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/purojekuto.svg'; // Assurez-vous que le chemin est correct
export default function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo et nom */}
                      <Link 
              to="/" 
            >
              
              <div className="flex items-center space-x-3">
            <div className=" flex items-center justify-center">
                <img 
        src={logo} 
        alt="MRO Logo" 
        className="w-10 h-10 mx-auto object-contain" 
      />
            </div>
                <h1 className="text-2xl font-bold tracking-tight">MRO</h1>
              </div>
            </Link>

          
          {/* Bouton Connexion - Version Desktop */}
          <div className="hidden md:block">
            <Link 
              to="/login" 
              className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Connexion
            </Link>
          </div>
          
          {/* Menu Mobile Button */}
          <button 
            className="md:hidden text-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {/* Menu Mobile Simplifié */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-royal-blue-700">
            <div className="pt-2">
              <Link 
                to="/login" 
                className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}