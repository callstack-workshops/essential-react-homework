import { useState } from 'react';
import { Fab, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddLotteryModal from './AddLotteryModal';

function App() {
  // State to control modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for notifications (toast)
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleSuccess = (message: string) => {
    setToast({
      open: true,
      message,
      severity: 'success',
    });
  };

  const handleError = (message: string) => {
    setToast({
      open: true,
      message,
      severity: 'error',
    });
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

      {/* Add Lottery Modal */}
      <AddLotteryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {/* Notification Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.severity === 'error' ? 6000 : 4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
