import logo from '../../assets/purojekuto.svg'; 
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Colonne 1 : Logo et description */}
          <div>
            <div className="flex items-center mb-4">
              <div className=" w-10 h-10 flex items-center justify-center mr-3">
                                <img 
                        src={logo} 
                        alt="MRO Logo" 
                        className="bg-white-900 w-10 h-10 mx-auto object-contain" 
                      />
              </div>
              <h2 className="text-2xl font-bold">MRO</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Solution complète pour la gestion de vos ressources et l'organisation efficace de votre entreprise.
            </p>
          </div>


          {/* Colonne 3 : Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-4 border-blue-600 pl-3">Nos Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gestion des ressources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Planification des projets</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Optimisation des processus</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Analyse de performance</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Formation & Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Solutions sur mesure</a></li>
            </ul>
          </div>

        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bas de page */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MRO Management Ressource Organizer. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}