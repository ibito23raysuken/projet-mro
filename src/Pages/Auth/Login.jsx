import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from './../../Context/AppContext';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import logo from '../../assets/purojekuto.svg'; 
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '', global: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // URL de l'API
  const apiUrl = import.meta.env.VITE_API_URL;
  const { setUser,setToken } = useContext(AppContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ username: '', password: '', global: '' });

    try {
      const response = await fetch(`${apiUrl}/api/securities/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Échec de la connexion');
      }
      const authHeader = response.headers.get('x-amzn-remapped-authorization');
      if (!authHeader) {
        throw new Error('Token non trouvé dans les headers');
      }
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      console.log( token);  
      console.log(responseData);
     localStorage.setItem("Token", token);
     localStorage.setItem("User", JSON.stringify(responseData));

     // Met à jour le contexte
    setToken(token);
    setUser(JSON.stringify(responseData));
    navigate('/');

    } catch (error) {
      if (error.message.toLowerCase().includes('utilisateur')) {
        setErrors(prev => ({ ...prev, username: error.message }));
      } else if (error.message.toLowerCase().includes('mot de passe')) {
        setErrors(prev => ({ ...prev, password: error.message }));
      } else {
        setErrors(prev => ({ ...prev, global: error.message }));
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-4 relative overflow-hidden">
      {/* Fond avec éléments décoratifs */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png')] opacity-10"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600 rounded-full opacity-10 blur-3xl"></div>

      {/* Carte de connexion */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl z-10 w-full max-w-md overflow-hidden backdrop-blur-sm">
        <div className="p-8">
          {/* En-tête avec logo */}
          <div className="flex flex-col items-center mb-8">
            <div className=" w-20 h-20  flex items-center justify-center">
              <img
                src={logo}
                alt="MRO Logo"
                className="w-24 h-24 mx-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white">MRO</h1>
            <p className="text-blue-300 mt-1 font-medium">Management Ressource Organizer</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-blue-100 text-sm font-medium mb-2" htmlFor="username">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-blue-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-3 placeholder-blue-300"
                  placeholder="Entrez votre nom d'utilisateur"
                  autoComplete="username"
                  required
                />
              </div>
              {errors.username && (
                <div className="text-red-500 text-sm mb-4">
                  {errors.username}
                </div>
              )}
            </div>

            <div>
              <label className="block text-blue-100 text-sm font-medium mb-2" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-blue-400" />
                </div>
                <input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  required
                  className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-3 pr-10 placeholder-blue-300"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-blue-400 hover:text-white transition-colors" />
                  ) : (
                    <FaEye className="text-blue-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm mb-4">
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : 'Se connecter'}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}