import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { Lottery } from "./types";
import { useSWRConfig } from "swr";

type LotteriesToRegisterAction =
  | { type: 'toggle'; lotteryId: string }
  | { type: 'clear' }
  | { type: 'set'; lotteryIds: string[] };

const lotteriesToRegisterReducer = (state: Set<string>, action: LotteriesToRegisterAction): Set<string> => {
  switch (action.type) {
    case 'toggle': {
      const newSet = new Set(state);
      if (newSet.has(action.lotteryId)) {
        newSet.delete(action.lotteryId);
      } else {
        newSet.add(action.lotteryId);
      }
      return newSet;
    }
    case 'clear':
      return new Set();
    case 'set':
      return new Set(action.lotteryIds);
    default:
      return state;
  }
};

interface LotteriesToRegisterContextValue {
  lotteriesToRegister: Set<string>;
  handleSelectLotteryToRegister: (lotteryId: string) => void;
  clearLotteriesToRegister: () => void;
  setLotteriesToRegister: (lotteryIds: string[]) => void;
}

const LotteriesToRegisterContext = createContext<LotteriesToRegisterContextValue | null>(null);

export const LotteriesToRegisterProvider = ({ children }: { children: ReactNode }) => {
  const [lotteriesToRegister, dispatch] = useReducer(lotteriesToRegisterReducer, new Set<string>());

  const handleSelectLotteryToRegister = useCallback((lotteryId: string) => {
    dispatch({ type: 'toggle', lotteryId });
  }, []);

  const clearLotteriesToRegister = useCallback(() => {
    dispatch({ type: 'clear' });
  }, []);

  const setLotteriesToRegister = useCallback((lotteryIds: string[]) => {
    dispatch({ type: 'set', lotteryIds });
  }, []);

  const value = useMemo(() => ({
    lotteriesToRegister,
    handleSelectLotteryToRegister,
    clearLotteriesToRegister,
    setLotteriesToRegister,
  }), [lotteriesToRegister, handleSelectLotteryToRegister, clearLotteriesToRegister, setLotteriesToRegister]);


  return (
    <LotteriesToRegisterContext.Provider value={value}>
      {children}
    </LotteriesToRegisterContext.Provider>
  );
};

export const useLotteriesToRegister = () => {
  const context = useContext(LotteriesToRegisterContext);
  const [isRegistering, setRegistering] = useState(false);
  const [errorRegistering, setErrorRegistering] = useState<Error>();

  const { mutate } = useSWRConfig();

  if (!context) {
    throw new Error('useLotteriesToRegister must be used within a LotteriesToRegisterProvider');
  }

  const {
    lotteriesToRegister,
    handleSelectLotteryToRegister,
    clearLotteriesToRegister,
    setLotteriesToRegister,
  } = context;

  const registerForLottery = useCallback(async (lotteryId: Lottery['id'], name: Lottery['name']) => {
    setRegistering(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        lotteryId,
        name,
      }),
    }).finally(() => {
      setRegistering(false);
    })

    if (!res.ok) {
      const err = await res.json();
      setErrorRegistering(err)
      throw new Error(err.error.message)
    }

    mutate(`${import.meta.env.VITE_API_URL}/lotteries`)
    return res.json();
  }, []);

  const registerForLotteries = useCallback((lotteryIds: Lottery['id'][], name: Lottery['name']) => {
    return Promise.all(lotteryIds.map(lid => registerForLottery(lid, name.trim())))
  }, [registerForLottery]);

  const resetErrorRegistering = useCallback(() => {
    setErrorRegistering(undefined);
  }, []);

  return useMemo(() => ({
    lotteriesToRegister,
    handleSelectLotteryToRegister,
    clearLotteriesToRegister,
    setLotteriesToRegister,
    registerForLottery,
    registerForLotteries,
    isRegistering,
    errorRegistering,
    resetErrorRegistering,
  }), [
    lotteriesToRegister, handleSelectLotteryToRegister, clearLotteriesToRegister, setLotteriesToRegister,
    // register
    registerForLottery, registerForLotteries, isRegistering, errorRegistering, resetErrorRegistering
  ]);
};
