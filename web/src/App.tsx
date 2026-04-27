import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Fab,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import type { Lottery } from './types';
import AddLottery from './components/AddLottery.tsx';
import LotteryCard from './components/LotteryCard.tsx';
import RegisterModal from './components/RegisterModal.tsx';

const API_URL = import.meta.env.VITE_API_URL as string;

function App() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [filter, setFilter] = useState('');

  const filteredLotteries = lotteries.filter((l) =>
    l.name.toLowerCase().includes(filter.toLowerCase()),
  );

  useEffect(() => {
    const fetchLotteries = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/lotteries`);
        const data = (await res.json()) as Lottery[];
        setLotteries(data);
      } catch {
        setLotteries([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchLotteries();
  }, [refreshKey]);

  const toggleLottery = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddSuccess = () => {
    setAddModalOpen(false);
    setSnackbar({ open: true, message: 'New lottery created' });
    setRefreshKey((k) => k + 1);
  };

  const handleRegisterSuccess = () => {
    setRegisterModalOpen(false);
    setSelectedIds(new Set());
    setSnackbar({ open: true, message: 'Registered to lotteries' });
  };

  return (
    <>
      <Typography variant="h3" sx={{ py: 4 }}>
        Lotteries 🎲
      </Typography>

      <TextField
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search"
        size="small"
        sx={{ width: 300, mb: 3, alignSelf: 'center' }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            px: 4,
            pb: 10,
          }}
        >
          {filteredLotteries.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ gridColumn: '1 / -1', textAlign: 'center', pt: 2 }}
            >
              No search results for &apos;{filter}&apos;
            </Typography>
          ) : (
            filteredLotteries.map((lottery) => (
              <LotteryCard
                key={lottery.id}
                lottery={lottery}
                selected={selectedIds.has(lottery.id)}
                onToggle={toggleLottery}
              />
            ))
          )}
        </Box>
      )}

      <Stack
        direction="row"
        spacing={1}
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <Fab
          variant="extended"
          disabled={selectedIds.size === 0}
          onClick={() => setRegisterModalOpen(true)}
        >
          REGISTER
        </Fab>
        <Fab
          color="primary"
          variant="extended"
          onClick={() => setAddModalOpen(true)}
        >
          <AddIcon sx={{ mr: 1 }} />
          ADD LOTTERY
        </Fab>
      </Stack>

      <AddLottery
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
      <RegisterModal
        open={registerModalOpen}
        selectedIds={[...selectedIds]}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        message={snackbar.message}
      />
    </>
  );
}

export default App;
