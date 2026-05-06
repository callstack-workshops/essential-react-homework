import { useCallback, useMemo, useState } from "react";

export const useToggle = (defaultState = false) => {
  const [isOn, setOn] = useState(defaultState);
  const handleToggle = useCallback((on = false) => () => {
    setOn(on)
  }, [setOn])
  const handleToggleOff = handleToggle(false);
  const handleToggleOn = handleToggle(true);

  return useMemo(() => ({
    isOn,
    handleToggleOff,
    handleToggleOn
  }), [isOn, handleToggleOff, handleToggleOn]);
};