import { Box, Grid, Paper, Typography } from "@mui/material"
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import CircularProgress from '@mui/material/CircularProgress';
import styled from "@emotion/styled";
import { AddLotteries } from "./AddLotteries";
import { useLotteries } from "./useLotteries";
import { RegisterForLotteries } from "./RegisterForLotteries";
import type { Lottery } from "./types";
import { useCallback } from "react";

const Item = styled(Paper)<{ finished?: boolean }>(({ finished }) => ({
  backgroundColor: finished ? '#f5f5f5' : '#fff',
  padding: '8px',
  cursor: finished ? 'default' : 'pointer',
  opacity: finished ? 0.6 : 1,
  'input:checked + &': {
    border: '2px solid #1976d2',
    borderOffset: '2px',
  },
}));

const Checkbox = styled('input')({
  position: 'absolute',
  opacity: 0,
  pointerEvents: 'none',
  display:'none'
});

export const Lotteries = () => {
  const { isLoading, lotteries, lotteriesToRegister, handleSelectLotteryToRegister } = useLotteries();

  const isFinished = useCallback((l: Lottery) => l.status === 'finished', []);

  return (
    <>
      <Box sx={{maxWidth: '800px', m: 'auto', mt: 5 }}>
        {!isLoading && !lotteries.length && (
          <Typography variant="body1" sx={{textAlign:'center', mt: 4}}>
            <SentimentDissatisfiedIcon />
            <br />
            There are no lotteries currently
          </Typography>
        )}

        {isLoading && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={100}/>
          </Box>
        )}

        {!!lotteries.length && (
          <Grid container spacing={3}>
            {lotteries.map((l) => (
              <Grid size={4} key={l.id}>
                <Box sx={{ position: 'relative' }}>
                  <Checkbox
                    type="checkbox"
                    id={l.id}
                    checked={lotteriesToRegister.has(l.id)}
                    onChange={() => handleSelectLotteryToRegister(l.id)}
                    tabIndex={0}
                    disabled={isFinished(l)}
                  />
                  <Item
                    finished={isFinished(l)}
                    tabIndex={isFinished(l) ? -1 : 0}
                    onClick={() => !isFinished(l) && handleSelectLotteryToRegister(l.id)}
                    onKeyDown={(e) => {
                      if (l.status !== 'finished' && (e.key === ' ' || e.key === 'Enter')) {
                        e.preventDefault();
                        handleSelectLotteryToRegister(l.id);
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>{l.name}</Typography>
                    <Typography variant="subtitle1">{l.prize}</Typography>
                  </Item>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <RegisterForLotteries />

      <AddLotteries />
    </>
  )
}