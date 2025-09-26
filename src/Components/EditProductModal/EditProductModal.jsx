import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  TextField, 
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function EditProductModal({ open, onClose, product, onSave, loading }) {
  const [localQuantity, setLocalQuantity] = useState(product?.quantity?.toString() || "");
  const [mode, setMode] = useState("replace"); // "replace" ou "add"

  useEffect(() => {
    if (product) setLocalQuantity(product.quantity.toString());
  }, [product]);

  const handleSave = () => {
    const value = parseFloat(localQuantity.replace(",", ".")) || 0;
    let newQuantity = product.quantity;

    if (mode === "replace") {
      newQuantity = value;
    } else if (mode === "add") {
      newQuantity = product.quantity + value;
    }

    onSave({ ...product, quantity: newQuantity });
  };

  const handleIncrement = () => {
    const number = parseFloat(localQuantity.replace(",", ".")) || 0;
    setLocalQuantity((number + 1).toString());
  };

  const handleDecrement = () => {
    const number = parseFloat(localQuantity.replace(",", ".")) || 0;
    setLocalQuantity(Math.max(0, number - 1).toString());
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleModal}>
        <Typography variant="h6" mb={2}>
          Modifier le stock: {product?.name}
        </Typography>

        <Typography mb={1}>
          Stock actuel: {product?.quantity}
        </Typography>

        {/* Choix du mode */}
        <RadioGroup 
          row 
          value={mode} 
          onChange={(e) => setMode(e.target.value)} 
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="replace" control={<Radio />} label="Remplacer" />
          <FormControlLabel value="add" control={<Radio />} label="Ajouter" />
        </RadioGroup>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <IconButton onClick={handleDecrement} disabled={loading}>
            <Remove />
          </IconButton>

          <TextField
            type="text"
            value={localQuantity}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9]*[.,]?[0-9]*$/.test(val) || val === "") {
                setLocalQuantity(val);
              }
            }}
            disabled={loading}
          />

          <IconButton onClick={handleIncrement} disabled={loading}>
            <Add />
          </IconButton>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Envoi..." : "Confirmer"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
