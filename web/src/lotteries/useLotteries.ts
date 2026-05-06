import { useCallback, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { useLotteriesToRegister } from "./useLotteriesToRegister";
import type { Lottery } from "./types";

const API_URL = `${import.meta.env.VITE_API_URL}/lotteries`;

export const useLotteries = () => {
  const { lotteriesToRegister, handleSelectLotteryToRegister, clearLotteriesToRegister, setLotteriesToRegister } = useLotteriesToRegister();
  const [searchFilter, setSearchFilter] = useState('');
  
  const apiUrl = searchFilter ? `${API_URL}?filter=${encodeURIComponent(searchFilter)}` : API_URL;
  const { data: lotteries, isLoading, error } = useSWR<Lottery[]>(apiUrl, (url: string) => fetch(url).then(res => res.json()));
  const [isAdding, setAdding] = useState(false);
  const [errorAdding, setErrorAdding] = useState<Error>();
  const { mutate } = useSWRConfig();

  const resetErrorAdding = useCallback(() => {
    setErrorAdding(undefined);
  }, []);

  const addLottery = useCallback(async (l: Pick<Lottery, 'name' |'prize'>) => {
    setAdding(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/lotteries`, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        name: l.name,
        prize: l.prize,
        type: 'simple',
      })
    }).finally(() => {
      setAdding(false);
    })
    
    if (!res.ok) {
      const err = new Error((await res.json()).error || 'Unknown error', { cause: res });
      setErrorAdding(err);
      throw err;
    }

    mutate(API_URL);
    return res.json();
  }, []);

  return useMemo(() => ({
    lotteriesToRegister,
    handleSelectLotteryToRegister,
    lotteries: lotteries || [],
    errorAdding,
    resetErrorAdding,
    addLottery,
    isAdding,
    isLoading,
    error,
    searchFilter,
    setSearchFilter,
  }), [
    lotteries, isLoading, error,
    // add
    addLottery, isAdding, errorAdding, resetErrorAdding, 
    // register
    lotteriesToRegister, handleSelectLotteryToRegister, clearLotteriesToRegister, setLotteriesToRegister,
    // search
    searchFilter, setSearchFilter
  ]);
}