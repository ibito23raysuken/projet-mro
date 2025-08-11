import { useState, useContext } from 'react';
import { AppContext } from './../../Context/AppContext';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/purojekuto.svg';
export default function TopBar() {
  const { token, user, setToken, setUser } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="MRO Logo"
                className="w-10 h-10 object-contain"
              />

              <h1 className="text-2xl font-bold tracking-tight">MRO</h1>
            </div>
          </Link>

          {/* Version Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {token && user ? (
              <div className="flex items-center gap-4 text-lg">
                <span className="font-medium">Bonjour, {JSON.parse(user).firstname}</span>
                <FaUserCircle className="text-3xl text-white-700" />
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-6 rounded-lg transition-colors text-lg"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Bouton Menu Mobile */}
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
            {token && user ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                  {/* Partie Bonjour + Icône */}
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <p className="mb-0 text-lg font-medium">
                      Bonjour, {JSON.parse(user).firstname}
                    </p>
                    <FaUserCircle className="text-3xl text-white-700" />
                  </div>

                  {/* Bouton Déconnexion */}
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>




            ) : (
              <Link
                to="/login"
                className="bg-royal-blue-600 hover:bg-royal-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
