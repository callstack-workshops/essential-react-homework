import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  selectedLotteries: string[];
}

function RegisterModal({
  open,
  onClose,
  onSuccess,
  onError,
  selectedLotteries,
}: RegisterModalProps) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Reset errors
    setNameError('');

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    if (name.trim().length < 4) {
      setNameError('Name must be at least 4 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Register for each selected lottery
      const registrationPromises = selectedLotteries.map((lotteryId) =>
        fetch(`${import.meta.env.VITE_API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lotteryId,
            name: name.trim(),
          }),
        }),
      );

      const responses = await Promise.all(registrationPromises);

      // Check if all requests succeeded
      const allSuccessful = responses.every((response) => response.ok);

      if (!allSuccessful) {
        throw new Error('Failed to register for some lotteries');
      }

      setIsLoading(false);
      setName('');
      onClose();
      onSuccess(
        `Successfully registered for ${selectedLotteries.length} ${selectedLotteries.length === 1 ? 'lottery' : 'lotteries'}!`,
      );
    } catch (error) {
      console.error('Error registering:', error);
      setIsLoading(false);
      onError(
        error instanceof Error ? error.message : 'Failed to register',
      );
    }
  };

  const handleClose = () => {
    setName('');
    setNameError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Register for lotteries</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Your name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleRegister}
          disabled={isLoading}
          variant="contained"
          sx={{ minWidth: 120 }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Registering...
            </Box>
          ) : (
            'Register'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RegisterModal;
