import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';

type Status = 'running' | 'finished';

type Lottery = {
  id: string;
  name: string;
  prize: string;
  type: string;
  status: Status;
};

interface LotteryListProps {
  refreshTrigger?: number;
}

function LotteryList({ refreshTrigger }: LotteryListProps) {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLotteries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/lotteries`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch lotteries');
        }

        const data = await response.json();
        setLotteries(data);
      } catch (error) {
        console.error('Error fetching lotteries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLotteries();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Lotteries
        </Typography>
      </Box>

      {lotteries.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '40vh',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            There are no lotteries currently
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {lotteries.map((lottery) => (
            <Card
              key={lottery.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: lottery.status === 'finished' ? 0.6 : 1,
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {lottery.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Prize: {lottery.prize}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    lottery.status === 'running' ? 'success.main' : 'error.main'
                  }
                  sx={{ mt: 1, display: 'block', textTransform: 'uppercase' }}
                >
                  {lottery.status}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default LotteryList;
