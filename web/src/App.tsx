import { Typography } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';

import { Lotteries } from "./lotteries/Lotteries";
import { LotteriesToRegisterProvider } from "./lotteries/useLotteriesToRegister";

import "./App.css";


function App() {


  return (
    <LotteriesToRegisterProvider>
      <Typography variant="h1" component="h1" sx={{ textAlign: 'center', mt: 2 }}>Lotteries <CasinoIcon sx={{ scale: 3, transformOrigin: 'bottom' }} /></Typography>

      <Lotteries />
    </LotteriesToRegisterProvider>
  );
}

export default App;
