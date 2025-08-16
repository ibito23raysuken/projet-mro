import { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../Context/AppContext';
import { Link, useNavigate,useLocation  } from 'react-router-dom';
import { FaPlus, FaUserCircle, FaRegEdit, FaSearch } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from "react-icons/md";
import EditProductModal from '../../Components/EditProductModal/EditProductModal';
import { MroService } from '../../api/mroService';

export default function Product() {
  // États pour la gestion des données
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  // États pour la pagination et la recherche
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    page: 0,  // Page 0-based pour l'API
    size: 5  // Nombre d'éléments par page
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,  // Page 1-based pour l'UI
    totalPages: 1,
    totalItems: 0
  });

  // États pour la modale d'édition
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Contexte et navigation
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  // URL de l'API
  const apiUrl = import.meta.env.VITE_API_URL;

  // Effet pour afficher le message de succès après la création d'un produit
  useEffect(() => {
    if (location.state?.success) {
      setSuccess(true);
      
      // Efface l'état après affichage (optionnel)
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  // Fetch products avec memoization
  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const { products: fetchedProducts, pagination: apiPagination } = await MroService.getProducts(searchParams, token);
      //console.log("Fetched products:", fetchedProducts);
      setProducts(fetchedProducts.products);
      setPagination({
        currentPage: apiPagination.currentPage + 1, // Convertir en 1-based
        totalPages: apiPagination.totalPages,
        totalItems: apiPagination.totalItems
      });
    } catch (err) {
      setError(err.message);
      //console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, searchParams]);

  // Effet pour charger les produits
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Gestionnaires d'événements
  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage - 1 // Convertir en 0-based
    }));
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchParams(prev => ({
      ...prev,
      keyword,
      page: 0 // Reset à la première page
    }));
  };

  const handlePageSizeChange = (e) => {
    setSearchParams(prev => ({
      ...prev,
      size: 5,
      page: 0
    }));
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression');
      }

      // Recharger les produits après suppression
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedProduct) => {
    try {
      setLoading(true);
      
      // Calculer la différence de quantité
      const oldProduct = products.find(p => p.id === updatedProduct.id);
      const quantityDiff = updatedProduct.quantity - oldProduct.quantity;
      
      if (quantityDiff !== 0) {
        const response = await fetch(
          `${apiUrl}/api/products/${updatedProduct.id}/stock`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              operation: quantityDiff > 0 ? 'increase' : 'decrease',
              quantity: Math.abs(quantityDiff)
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Échec de la mise à jour');
        }
      }

      // Mettre à jour les données locales
      await fetchProducts();
      setModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/ajout_produits');
  };
  console.log("etat de success", success);
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Produits</h1>
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Produit créé avec succès!
                    </div>
                )}
      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchParams.keyword}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaPlus />
            Ajouter
          </button>
        </div>
      </div>



      {/* Tableau des produits */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <p>Chargement en cours...</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix (Ar)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      {searchParams.keyword ? 'Aucun résultat trouvé' : 'Aucun produit disponible'}
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/products/${product.id}`} className="text-blue-600 hover:text-blue-800">
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Intl.NumberFormat('fr-FR').format(product.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Modifier"
                        >
                          <FaRegEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <MdOutlineDeleteOutline size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{products.length}</span> sur{' '}
                    <span className="font-medium">{pagination.totalItems}</span> produits
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Première page</span>
                      «
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Précédent</span>
                      ‹
                    </button>

                    {/* Affichage des pages */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Suivant</span>
                      ›
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Dernière page</span>
                      »
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal d'édition */}
      <EditProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
}