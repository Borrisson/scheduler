import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replacing = false) {
    if (replacing) {
      history.pop();
    }
    setMode(newMode);
    setHistory([...history, newMode]);
  }

  function back() {
    const buffer = [...history];
    if (history.length > 1) {
      buffer.pop();
      setMode(buffer[buffer.length - 1]);
      setHistory(buffer);
    }
  }

  return { mode, transition, back };
}
