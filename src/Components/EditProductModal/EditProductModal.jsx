import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  TextField,
  Alert
} from '@mui/material';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export default function EditProductModal({ open, onClose, product, onSave, loading, mode }) {
  const [localQuantity, setLocalQuantity] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setLocalQuantity("0");
      setError("");
    }
  }, [product, open]);

  const handleSave = () => {
    const value = parseFloat(localQuantity.replace(",", ".")) || 0;
    
    if (value <= 0) {
      setError("La quantité doit être supérieure à 0");
      return;
    }

    if (mode === "remove" && value > product.quantity) {
      setError(`Vous ne pouvez pas retirer plus que le stock actuel (${product.quantity})`);
      return;
    }

    let newQuantity = product.quantity;

    if (mode === "add") {
      newQuantity = product.quantity + value;
    } else if (mode === "remove") {
      newQuantity = Math.max(0, product.quantity - value);
    }

    // Arrondir à 2 décimales
    newQuantity = Math.round(newQuantity * 100) / 100;

    onSave({ ...product, quantity: newQuantity });
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    
    // Accepter les nombres décimaux avec point ou virgule
    if (/^[0-9]*[.,]?[0-9]*$/.test(val) || val === "") {
      setLocalQuantity(val);
      setError("");
      
      // Validation en temps réel
      const numericValue = parseFloat(val.replace(",", ".")) || 0;
      
      if (val !== "" && numericValue <= 0) {
        setError("La quantité doit être supérieure à 0");
      } else if (mode === "remove" && numericValue > product?.quantity) {
        setError(`Maximum: ${product?.quantity}`);
      } else {
        setError("");
      }
    }
  };
  // Calcul du nouveau stock
  const calculateNewStock = () => {
    const value = parseFloat(localQuantity.replace(",", ".")) || 0;
    if (mode === "add") {
      return product?.quantity + value;
    } else if (mode === "remove") {
      return Math.max(0, product?.quantity - value);
    }
    return product?.quantity;
  };
  const getTitle = () => {
    return mode === "add" 
      ? `Ajouter au stock: ${product?.name}`
      : `Retirer du stock: ${product?.name}`;
  };

  const getActionText = () => {
    return mode === "add" ? "Ajouter" : "Retirer";
  };

  const getDescription = () => {
    const value = parseFloat(localQuantity.replace(",", ".")) || 0;
    return `Stock actuel: ${product?.quantity}`;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleModal}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          {getTitle()}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          {getDescription()}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" mb={1} fontWeight="medium">
            Quantité à {mode === "add" ? "ajouter" : "retirer"}:
          </Typography>
          
          <TextField
            type="text"
            value={localQuantity}
            onChange={handleQuantityChange}
            disabled={loading}
            placeholder="0.00"
            fullWidth
            error={!!error}
            // On enlève le helperText précédent
            inputProps={{
              inputMode: "decimal",
              pattern: "[0-9]*[.,]?[0-9]*"
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, color: !error ? 'text.secondary' : 'error.main' }}>
            {product ? (
              <>
                 Nouveau Stock : {calculateNewStock().toFixed(2)}
              </>
            ) : (
              'Chargement...'
            )}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || !!error || parseFloat(localQuantity.replace(",", ".")) <= 0}
            color={mode === "add" ? "success" : "warning"}
          >
            {loading ? "Envoi..." : getActionText()}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}