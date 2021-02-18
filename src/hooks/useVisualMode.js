import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const buffer = [...history];

  function transition(newMode, replacing = false) {
    if (replacing) {
      buffer.pop();
    }
    setMode(newMode);
    setHistory([...buffer, newMode]);
  }

  function back() {
    if (history.length > 1) {
      buffer.pop();
      setMode(buffer[buffer.length - 1]);
      setHistory(buffer);
    }
  }

  return { mode, transition, back };
}
