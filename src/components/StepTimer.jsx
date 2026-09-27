import { useEffect, useRef, useState } from 'react';
import { updateQueueTime } from '../lib/queueApi';

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

export default function StepTimer({ queueRow, onDone }) {
  const [secondsLeft, setSecondsLeft] = useState(queueRow.time_remaining);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          updateQueueTime(queueRow.queueid, 0);
          onDone?.(queueRow.queueid);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const toggle = () => {
    const next = !running;
    setRunning(next);
    if (!next) updateQueueTime(queueRow.queueid, secondsLeft);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(queueRow.steps?.step_duration ?? queueRow.time_remaining);
    updateQueueTime(queueRow.queueid, queueRow.steps?.step_duration ?? queueRow.time_remaining);
  };

  const isDone = secondsLeft === 0;

  return (
    <div className={`step-timer ${running ? 'is-running' : ''} ${isDone ? 'is-done' : ''}`}>
      <span className="step-timer__display">{formatTime(secondsLeft)}</span>
      <div className="step-timer__controls">
        <button
          type="button"
          className="step-timer__toggle"
          onClick={toggle}
          disabled={isDone}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button type="button" className="step-timer__reset" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
