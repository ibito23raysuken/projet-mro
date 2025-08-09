import { useState, useEffect } from 'react';

export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // URL de l'API
  const apiUrl = import.meta.env.VITE_API_URL_DEV;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);         
        const response = await fetch(`${apiUrl}/ping`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setApiData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors de la récupération des données:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-800 mb-2">
            Bienvenue sur MRO Dashboard
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Gestion centralisée de vos ressources et données d'API
          </p>
          
          <div className="bg-indigo-50 rounded-xl p-6 mb-8 border-2 border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
              <span className="bg-indigo-600 text-white p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              Données de l'API
            </h2>
            
            
            {loading && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600">Chargement des données en cours...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                      <p className="mt-2">Veuillez réessayer ou vérifier la console pour plus de détails.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {apiData && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="p-4">
                  <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                    {JSON.stringify(apiData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
