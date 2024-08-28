'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { getDocs, query, collection, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [customQuantity, setCustomQuantity] = useState(0);
  const [customAction, setCustomAction] = useState('add'); // 'add' or 'remove'
  const [selectedItem, setSelectedItem] = useState('');

  const updateInventory = useCallback(async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data()
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  }, []);

  const addItem = useCallback(async (item, quantity = 1) => {
    if (!item || quantity <= 0) return;

    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity: currentQuantity } = docSnap.data();
        await setDoc(docRef, { quantity: currentQuantity + quantity });
      } else {
        await setDoc(docRef, { quantity });
      }

      await updateInventory();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  }, [updateInventory]);

  const removeItem = useCallback(async (item, quantity = 1) => {
    if (!item || quantity <= 0) return;

    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity: currentQuantity } = docSnap.data();
        if (currentQuantity <= quantity) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: currentQuantity - quantity });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  }, [updateInventory]);

  const deleteItem = useCallback(async (item) => {
    try {
      await deleteDoc(doc(collection(firestore, 'inventory'), item));
      await updateInventory();
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  }, [updateInventory]);

  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCustomOpen = (item) => {
    setSelectedItem(item);
    setCustomOpen(true);
  };
  const handleCustomClose = () => {
    setCustomQuantity(0);
    setCustomAction('add');
    setCustomOpen(false);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundColor: 'gray',
        padding: '10px',
        animation: 'backgroundAnimation 12s infinite alternate',
        '@keyframes backgroundAnimation': {
          '0%': { backgroundColor: '#4682B4' }, // Steel Blue
          '100%': { backgroundColor: '#778899' } // Light Slate Gray
        }
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={{ xs: '90%', sm: 400 }}
          bgcolor="gray"
          borderRadius="8px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6" textAlign="center">Add item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              placeholder="Item name"
            />
            <Button
              variant='outlined'
              onClick={() => {
                if (itemName) {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }
              }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={customOpen} onClose={handleCustomClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={{ xs: '90%', sm: 400 }}
          bgcolor="gray"
          borderRadius="8px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6" textAlign="center">Custom Quantity</Typography>
          <TextField
            select
            fullWidth
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </TextField>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              type="number"
              variant="outlined"
              fullWidth
              value={customQuantity}
              onChange={(e) => {
                setCustomQuantity(Number(e.target.value));
              }}
              placeholder="Quantity"
            />
            <Button
              variant='outlined'
              onClick={() => {
                if (selectedItem && customQuantity > 0) {
                  if (customAction === 'add') {
                    addItem(selectedItem, customQuantity);
                  } else {
                    removeItem(selectedItem, customQuantity);
                  }
                  handleCustomClose();
                }
              }}
            >
              {customAction === 'add' ? 'ADD' : 'REMOVE'}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant='contained'
        onClick={handleOpen}
        sx={{ marginBottom: 2, width: { xs: '100%', sm: 'auto' } }}
      >
        Add New Item
      </Button>
      <Box
        width={{ xs: '100%', sm: '80%' }}
        border='1px solid #333'
        borderRadius="8px"
        boxShadow={2}
      >
        <Box
          width="100%"
          height={{ xs: '70px', sm: '100px' }}
          bgcolor="#1E90FF"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography
            variant='h4'
            color="white"
            textAlign="center"
          >
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="100%"
          maxHeight="400px"
          spacing={2}
          overflow="auto"
          p={2}
          bgcolor="gray"
          borderRadius="0 0 8px 8px"
        >
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="120px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#333"
              padding={2}
              borderRadius="8px"
              flexDirection={{ xs: 'column', sm: 'row' }}
            >
              <Typography variant="h6" color="white" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}: {quantity}
              </Typography>
              <Stack direction="row" spacing={2} mt={{ xs: 2, sm: 0 }}>
                <Button
                  variant='contained'
                  sx={{ bgcolor: '#1E90FF', '&:hover': { bgcolor: '#1C86EE' } }}
                  onClick={() => handleCustomOpen(name)}
                >
                  Modify
                </Button>
                <Button
                  variant='contained'
                  sx={{ bgcolor: '#FF4500', '&:hover': { bgcolor: '#FF6347' } }}
                  onClick={() => deleteItem(name)}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
