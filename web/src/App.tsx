import { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function App() {
  // State to control modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to store form values
  const [lotteryName, setLotteryName] = useState('');
  const [lotteryPrize, setLotteryPrize] = useState('');

  // State to store validation errors
  const [nameError, setNameError] = useState('');
  const [prizeError, setPrizeError] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Clear form and errors when opening
    setLotteryName('');
    setLotteryPrize('');
    setNameError('');
    setPrizeError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    // Reset errors
    setNameError('');
    setPrizeError('');

    // Validate fields
    let isValid = true;

    if (!lotteryName.trim()) {
      setNameError('Lottery name is required');
      isValid = false;
    } else if (lotteryName.trim().length < 4) {
      setNameError('Lottery name must be at least 4 characters long');
      isValid = false;
    }

    if (!lotteryPrize.trim()) {
      setPrizeError('Lottery prize is required');
      isValid = false;
    } else if (lotteryPrize.trim().length < 4) {
      setPrizeError('Lottery prize must be at least 4 characters long');
      isValid = false;
    }

    // Only proceed if validation passes
    if (isValid) {
      console.log('Lottery Name:', lotteryName);
      console.log('Lottery Prize:', lotteryPrize);
      handleCloseModal();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        variant="extended"
        color="primary"
        aria-label="add lottery"
        onClick={handleOpenModal}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon sx={{ mr: 1 }} />
        ADD LOTTERY
      </Fab>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add a new lottery</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lottery name"
            type="text"
            fullWidth
            variant="outlined"
            value={lotteryName}
            onChange={(e) => setLotteryName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Lottery prize"
            type="text"
            fullWidth
            variant="outlined"
            value={lotteryPrize}
            onChange={(e) => setLotteryPrize(e.target.value)}
            error={!!prizeError}
            helperText={prizeError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
