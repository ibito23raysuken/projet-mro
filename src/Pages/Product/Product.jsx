import { useState, useEffect, useContext } from 'react';
import { AppContext } from './../../Context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaUserCircle,FaRegEdit,FaSearch } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from "react-icons/md";
import EditProductModal from '../../Components/EditProductModal/EditProductModal';
const initialProducts = [
  // Ajoute plus si tu veux
];

export default function Product() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // URL de l'API
  const apiUrl = import.meta.env.VITE_API_URL;

  //modal variable 
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur de chargement des données');
        }

        const data = await response.json();
        setProducts(data.products || initialProducts);

      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    } else {
      // Pas de token, on peut remettre les produits initiaux ou vider la liste
      setProducts(initialProducts);
    }
  }, [token]);

  // Filtrer les produits par recherche
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset page à 1 à chaque recherche
  };

    // Enregistrer les changements (local ici, mais peut faire API)
const handleSave = async (updatedProduct) => {
  try {
    setLoading(true);
    
    // Calculate quantity difference
    const oldProduct = products.find(p => p.id === updatedProduct.id);
    const quantityDiff = updatedProduct.quantity - oldProduct.quantity;
    
    if (quantityDiff === 0) {
      setModalOpen(false);
      return;
    }

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
      throw new Error(errorData.message || 'Failed to update stock');
    }

    // Update local state
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    setModalOpen(false);
    
  } catch (err) {
    console.error("Stock update error:", err);
    setError(err.message);
    // Optionally revert the quantity in UI
    setSelectedProduct(oldProduct); 
  } finally {
    setLoading(false);
  }
};
  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    navigate('/ajout_produits');
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des produits</h1>

      <div className="flex justify-between mb-4">
        <div className="flex items-center border border-gray-400 rounded px-3 py-2 w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="outline-none w-full"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FaPlus />
          Ajouter un produit
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left"># ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Nom</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Prix unitaire (Ar)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Quantité</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">Aucun produit trouvé</td>
              </tr>
            ) : (
              currentProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.unitPrice}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 text-lg"
                    >
                      <FaRegEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-lg"
                    >
                      <MdOutlineDeleteOutline size={20} />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
            {/* Modal d’édition */}
      <EditProductModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        product={selectedProduct} 
        onSave={handleSave} 
      />
    </div>
  );
}
