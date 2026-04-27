import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import type { Lottery } from '../types';

type Props = {
  lottery: Lottery;
  selected: boolean;
  onToggle: (id: string) => void;
};

function LotteryCard({ lottery, selected, onToggle }: Props) {
  const isFinished = lottery.status === 'finished';

  return (
    <Card
      variant="outlined"
      sx={{
        opacity: isFinished ? 0.5 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        borderWidth: selected ? 2 : 1,
      }}
    >
      <CardActionArea
        disabled={isFinished}
        onClick={() => onToggle(lottery.id)}
      >
        <CardContent sx={{ textAlign: 'left' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {lottery.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lottery.prize}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lottery.id}
              </Typography>
            </Box>
            <AutorenewIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default LotteryCard;
