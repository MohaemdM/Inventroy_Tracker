'use client'
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { getDocs, query, collection, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customRemoveOpen, setCustomRemoveOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [customQuantity, setCustomQuantity] = useState(0);
  const [customRemoveQuantity, setCustomRemoveQuantity] = useState(0);
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
    if (!item || quantity <= 0) return; // Validate item and quantity

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
    if (!item || quantity <= 0) return; // Validate item and quantity

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

  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCustomOpen = (item) => {
    setSelectedItem(item);
    setCustomOpen(true);
  }
  const handleCustomClose = () => setCustomOpen(false);
  const handleCustomRemoveOpen = (item) => {
    setSelectedItem(item);
    setCustomRemoveOpen(true);
  }
  const handleCustomRemoveClose = () => setCustomRemoveOpen(false);

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      style={{ backgroundColor: 'white' }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
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
          width={400}
          bgcolor="white"
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
          <Typography variant="h6" textAlign="center">Add custom quantity</Typography>
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
                  addItem(selectedItem, customQuantity);
                  setCustomQuantity(0);
                  handleCustomClose();
                }
              }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={customRemoveOpen} onClose={handleCustomRemoveClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
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
          <Typography variant="h6" textAlign="center">Remove custom quantity</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              type="number"
              variant="outlined"
              fullWidth
              value={customRemoveQuantity}
              onChange={(e) => {
                setCustomRemoveQuantity(Number(e.target.value));
              }}
              placeholder="Quantity"
            />
            <Button
              variant='outlined'
              onClick={() => {
                if (selectedItem && customRemoveQuantity > 0) {
                  removeItem(selectedItem, customRemoveQuantity);
                  setCustomRemoveQuantity(0);
                  handleCustomRemoveClose();
                }
              }}
            >
              REMOVE
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant='contained'
        onClick={handleOpen}
        sx={{ marginBottom: 2 }}
      >
        Add New Item
      </Button>
      <Box width="80%" border='1px solid #333' borderRadius="8px" boxShadow={2}>
        <Box
          width="100%"
          height="100px"
          bgcolor="lightblue"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography
            variant='h2'
            color="#333"
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
          bgcolor="white"
          borderRadius="0 0 8px 8px"
        >
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
              borderRadius="8px"
            >
              <Typography variant="h6" color="#333">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant='contained' onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant='contained' onClick={() => removeItem(name)}>
                  Remove
                </Button>
                <Button variant='contained' onClick={() => handleCustomOpen(name)}>
                  Custom Add
                </Button>
                <Button variant='contained' onClick={() => handleCustomRemoveOpen(name)}>
                  Custom Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}