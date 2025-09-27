import { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../Context/AppContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPlus, FaUserCircle, FaRegEdit, FaSearch, FaMinus, FaBox } from 'react-icons/fa';
import { MdOutlineDeleteOutline, MdInventory2 } from "react-icons/md";
import EditProductModal from '../../Components/EditProductModal/EditProductModal';
import { MroService } from '../../api/mroService';

export default function Product() {
  // États pour la gestion des données
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    page: 0,
    size: 5
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (location.state?.success) {
      setSuccess(true);
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const { products: fetchedProducts, pagination: apiPagination } = await MroService.getProducts(searchParams, token);
      setProducts(fetchedProducts.products);
      setPagination({
        currentPage: apiPagination.currentPage + 1,
        totalPages: apiPagination.totalPages,
        totalItems: apiPagination.totalItems
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage - 1
    }));
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchParams(prev => ({
      ...prev,
      keyword,
      page: 0
    }));
  };

  const handleOpenModal = (product, mode) => {
    setSelectedProduct(product);
    setModalMode(mode);
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

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
    
    setTimeout(() => {
      if (circle.parentElement === button) {
        button.removeChild(circle);
      }
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Produits</h1>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Produit créé avec succès!
        </div>
      )}
      
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-400 mb-2">
                        <MdInventory2 className="text-4xl mx-auto" />
                      </div>
                      <p className="text-gray-500 text-lg">
                        {searchParams.keyword ? 'Aucun résultat trouvé' : 'Aucun produit disponible'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      {/* Colonne Produit */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaBox className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">REF: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Colonne Type */}
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {product.typeProduct?.name || 'Non spécifié'}
                        </span>
                      </td>
                     

                                            {/* Colonne Quantité */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-2 rounded-full text-sm font-bold ${
                          product.quantity === 0 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : product.quantity <= 10 
                            ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                                   

                      {/* Colonne État */}
                      <td className="px-6 py-4 text-center">
                        {product.quantity <= 10 ? (
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            product.quantity === 0 
                              ? 'bg-red-500 text-white' 
                              : 'bg-orange-500 text-white'
                          }`}>
                            {product.quantity === 0 ? '🔴 RUPTURE' : '🟠 FAIBLE'}
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                            🟢 NORMAL
                          </span>
                        )}
                      </td>
                      {/* Colonne Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              handleOpenModal(product, 'remove');
                              createRipple(e);
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 hover:bg-orange-200 text-orange-700 hover:text-orange-800 transition-colors duration-200"
                            title="Diminuer le stock"
                          >
                            <FaMinus size={12} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              handleOpenModal(product, 'add');
                              createRipple(e);
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 transition-colors duration-200"
                            title="Augmenter le stock"
                          >
                            <FaPlus size={12} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              handleDelete(product.id);
                              createRipple(e);
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 transition-colors duration-200"
                            title="Supprimer le produit"
                          >
                            <MdOutlineDeleteOutline size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page {pagination.currentPage} sur {pagination.totalPages}
                </span>
              </div>
              
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 border text-sm font-medium ${
                        pagination.currentPage === pageNumber
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <EditProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onSave={handleSave}
        loading={loading}
        mode={modalMode}
      />

      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}