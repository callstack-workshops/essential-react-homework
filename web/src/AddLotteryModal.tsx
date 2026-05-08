import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface AddLotteryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

function AddLotteryModal({
  open,
  onClose,
  onSuccess,
  onError,
}: AddLotteryModalProps) {
  // State to store form values
  const [lotteryName, setLotteryName] = useState('');
  const [lotteryPrize, setLotteryPrize] = useState('');

  // State to store validation errors
  const [nameError, setNameError] = useState('');
  const [prizeError, setPrizeError] = useState('');

  // State to track loading
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
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
      setIsLoading(true);

      try {
        // Make API call to save lottery
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/lotteries`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'simple',
              name: lotteryName,
              prize: lotteryPrize,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to create lottery');
        }

        const data = await response.json();
        console.log('Lottery created:', data);

        setIsLoading(false);

        // Clear form
        setLotteryName('');
        setLotteryPrize('');

        onClose();
        onSuccess('Lottery added successfully!');
      } catch (error) {
        console.error('Error creating lottery:', error);
        setIsLoading(false);
        onError(
          error instanceof Error ? error.message : 'Failed to create lottery',
        );
      }
    }
  };

  const handleClose = () => {
    // Clear form and errors when closing
    setLotteryName('');
    setLotteryPrize('');
    setNameError('');
    setPrizeError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
        <LoadingButton
          onClick={handleAdd}
          loading={isLoading}
          loadingIndicator={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Adding...
            </Box>
          }
          variant="contained"
          sx={{ minWidth: 120 }}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default AddLotteryModal;
