import { useState, useEffect, useContext } from 'react';
import { AppContext } from './../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MroService } from '../../api/mroService';
import { FaPlus, FaArrowLeft } from "react-icons/fa";
export default function CreateProduct() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [typeProduct, setTypeProduct] = useState("");
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AppContext);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTypeProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await MroService.getProductTypes(token); // Ajout du token manquant
               // console.log("Types fetched:", response);
                
                // La réponse est déjà parsée par MroService, pas besoin de .json()
                if (!response) {
                    throw new Error('Erreur de chargement des types de produits');
                }

                // Utilisation directe de response qui contient déjà les données parsées
                setTypes(Array.isArray(response) ? response : response.content || []);

            } catch (err) {
                console.error("Erreur de chargement:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchTypeProducts();
        }
    }, [token, apiUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!typeProduct) {
            setError("Veuillez sélectionner un type de produit");
            return;
        }

        const selectedType = types.find((t) => t.id === typeProduct);
        if (!selectedType) {
            setError("Type de produit invalide");
            return;
        }

        const newProduct = {
            name,
            description,
            unitPrice: parseFloat(unitPrice),
            quantity: parseFloat(quantity),
            typeProduct: selectedType,
        };

        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newProduct),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la création du produit");
            }

            setSuccess(true);
            navigate('/', { 
                state: { success: true } 
                // Alternative : replace: true pour empêcher le retour
            });
        } catch (error) {
            console.error("Erreur:", error);
            setError(error.message || "Erreur lors de la création du produit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                   
                    Ajouter un produit
                </h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Produit créé avec succès!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom */}
                    <div>
                        <label className="block font-semibold text-gray-700">Nom</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-semibold text-gray-700">Description</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Prix */}
                    <div>
                        <label className="block font-semibold text-gray-700">Prix unitaire</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Quantité */}
                    <div>
                        <label className="block font-semibold text-gray-700">Quantité</label>
                        <input
                            type="number"
                             step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Type de produit */}
                    <div>
                        <label className="block font-semibold text-gray-700">Type de produit</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            value={typeProduct}
                            onChange={(e) => setTypeProduct(e.target.value)}
                            required
                            disabled={loading || types.length === 0}
                        >
                            <option value="">-- Sélectionner --</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {loading && types.length === 0 && (
                            <p className="text-sm text-gray-500 mt-1">Chargement des types...</p>
                        )}
                    </div>

                    {/* Bouton */}
                    <div className="flex justify-end gap-3">
                        {/* Bouton Ajouter */}
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
                            disabled={loading}
                        >
                            <FaPlus />
                            {loading ? "En cours..." : "Enregistrer"}
                        </button>

                        {/* Bouton Retour */}
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 border border-gray-400 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            <FaArrowLeft />
                            Retour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}