import { Box, Grid, InputAdornment, Paper, TextField, Typography } from "@mui/material"
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import CircularProgress from '@mui/material/CircularProgress';
import styled from "@emotion/styled";
import { AddLotteries } from "./AddLotteries";
import { useLotteries } from "./useLotteries";
import { RegisterForLotteries } from "./RegisterForLotteries";
import type { Lottery } from "./types";

const Item = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'finished',
})<{ finished?: boolean }>(({ finished }) => ({
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
  const { isLoading, lotteries, lotteriesToRegister, handleSelectLotteryToRegister, searchFilter, setSearchFilter } = useLotteries();

  
  const hasSearchFilter = searchFilter.trim().length > 0;
  const noSearchResults = !isLoading && hasSearchFilter && !lotteries.length;
  const noLotteries = !isLoading && !hasSearchFilter && !lotteries.length;

  const isFinished = (l: Lottery) => l.status === 'finished';

  return (
    <>
      <Box sx={{maxWidth: '800px', m: 'auto', mt: 5 }}>
        <TextField
          fullWidth
          placeholder="Search lotteries..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 3 }}
        />

        {noLotteries && (
          <Typography variant="body1" sx={{textAlign:'center', mt: 4}}>
            <SentimentDissatisfiedIcon />
            <br />
            There are no lotteries currently
          </Typography>
        )}

        {noSearchResults && (
          <Typography variant="body1" sx={{textAlign:'center', mt: 4}}>
            <SearchOffIcon />
            <br />
            No lotteries found for "{searchFilter}"
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
                      if (!isFinished(l) && (e.key === ' ' || e.key === 'Enter')) {
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