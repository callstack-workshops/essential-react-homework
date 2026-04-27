import { useState } from 'react';
import { Snackbar, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddLottery from './components/AddLottery.tsx';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSuccess = () => {
    setModalOpen(false);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Fab
        color="primary"
        variant="extended"
        aria-label="add"
        onClick={() => setModalOpen(true)}
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Lottery
      </Fab>
      <AddLottery
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="New lottery created"
      />
    </>
  );
}

export default App;
