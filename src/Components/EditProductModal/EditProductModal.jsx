import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './../../Context/AppContext';
import { FaPlus, FaUserCircle, FaRegEdit, FaSearch } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  TextField, 
  IconButton 
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
  const [localQuantity, setLocalQuantity] = useState(product?.quantity || 0);

  useEffect(() => {
    if (product) setLocalQuantity(product.quantity);
  }, [product]);

  const handleSave = () => {
    onSave({ ...product, quantity: localQuantity });
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

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <IconButton 
            onClick={() => setLocalQuantity(p => Math.max(0, p - 1))}
            disabled={loading}
          >
            <Remove />
          </IconButton>
          
        <TextField
          type="number"
          value={localQuantity}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            setLocalQuantity(Math.max(0, val));
          }}
          inputProps={{ min: 0, step: "any" }} 
          disabled={loading}
        />
          
          <IconButton 
            onClick={() => setLocalQuantity(p => p + 1)}
            disabled={loading}
          >
            <Add />
          </IconButton>
        </Box>

        <Typography color="textSecondary" mb={2}>
          Modification: {localQuantity - product?.quantity} unités
          ({localQuantity > product?.quantity ? 'augmentation' : 'réduction'})
        </Typography>

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={loading || localQuantity === product?.quantity}
          >
            {loading ? 'Envoi...' : 'Confirmer'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}