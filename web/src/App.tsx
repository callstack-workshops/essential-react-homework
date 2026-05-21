import { useState } from 'react';
import { Fab, Snackbar, Alert, Slide } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AddLotteryModal from './AddLotteryModal';
import LotteryList from './LotteryList';
import RegisterModal from './RegisterModal';

function App() {
  // State to control add lottery modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to control register modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // State for selected lotteries
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>([]);

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

  // State to trigger lottery list refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleSelectLottery = (id: string) => {
    setSelectedLotteries((prev) =>
      prev.includes(id) ? prev.filter((lotteryId) => lotteryId !== id) : [...prev, id],
    );
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
    // Trigger lottery list refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRegisterSuccess = (message: string) => {
    setToast({
      open: true,
      message,
      severity: 'success',
    });
    // Clear selection after successful registration
    setSelectedLotteries([]);
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
      {/* Lottery List */}
      <LotteryList
        refreshTrigger={refreshTrigger}
        selectedLotteries={selectedLotteries}
        onSelectLottery={handleSelectLottery}
      />

      {/* Register FAB - Animated show/hide when lotteries are selected */}
      <Slide direction="up" in={selectedLotteries.length > 0} unmountOnExit>
        <Fab
          variant="extended"
          color="secondary"
          aria-label="register"
          onClick={handleOpenRegisterModal}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 200,
          }}
        >
          <HowToRegIcon sx={{ mr: 1 }} />
          REGISTER
        </Fab>
      </Slide>

      {/* Add Lottery FAB */}
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

      {/* Register Modal */}
      <RegisterModal
        open={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onSuccess={handleRegisterSuccess}
        onError={handleError}
        selectedLotteries={selectedLotteries}
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
