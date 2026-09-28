import { useEffect, useState } from 'react';
import { getQueue, startQueue, updateQueueOrder, updateQueueStatus } from '../lib/queueApi';
import StepTimer from './StepTimer';

export default function QueuePage({ recipe }) {
  const [queue, setQueue] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    let active = true;
    startQueue(recipe.recipeid)
      .then(() => getQueue(recipe.recipeid))
      .then((rows) => {
        if (active) {
          setQueue(rows);
          setOpenId(rows[0]?.queueid ?? null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [recipe.recipeid]);

  const persistOrder = async (next) => {
    setQueue(next);
    await updateQueueOrder(next.map((q, i) => ({ queueid: q.queueid, queue_order: i })));
  };

  const dropAt = (targetIndex) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...queue];
    const [moved] = next.splice(dragIndex, 1);
    const adjusted = dragIndex < targetIndex ? targetIndex - 1 : targetIndex;
    next.splice(adjusted, 0, moved);
    setDragIndex(null);
    persistOrder(next);
  };

  const dropAtEnd = () => {
    if (dragIndex === null) return;
    const next = [...queue];
    const [moved] = next.splice(dragIndex, 1);
    next.push(moved);
    setDragIndex(null);
    persistOrder(next);
  };

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= queue.length) return;
    const next = [...queue];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  };

  const markDone = async (queueId) => {
    await updateQueueStatus(queueId, 'done');
    setQueue((prev) =>
      prev.map((q) => (q.queueid === queueId ? { ...q, status: 'done' } : q))
    );
  };

  if (loading) return <p className="text-small">Building your queue…</p>;

  return (
    <div className="queue-page">
      <h1 className="text-main-heading">{recipe.name}</h1>

      <ol className="queue-page__list">
        {queue.map((q, i) => {
          const open = openId === q.queueid;
          return (
            <li
              key={q.queueid}
              className={`queue-row ${q.status === 'done' ? 'is-done' : ''} ${
                dragIndex === i ? 'is-dragging' : ''
              }`}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropAt(i)}
            >
              <div className="queue-row__reorder">
                <span className="queue-row__handle" aria-hidden="true">
                  ⠿
                </span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === queue.length - 1}
                >
                  ↓
                </button>
              </div>

              <button
                type="button"
                className="queue-row__header text-heading-1"
                onClick={() => setOpenId(open ? null : q.queueid)}
              >
                <span>
                  {i + 1}. {q.steps.step_name}
                </span>
                <span className="queue-row__caret">{open ? '▲' : '▼'}</span>
              </button>

              {open && (
                <div className="queue-row__body">
                  {q.steps.step_description && (
                    <p className="text-small">{q.steps.step_description}</p>
                  )}
                  <StepTimer queueRow={q} onDone={markDone} />
                  <button
                    type="button"
                    className="queue-row__done btn-outline"
                    disabled={q.status === 'done'}
                    onClick={() => markDone(q.queueid)}
                  >
                    {q.status === 'done' ? 'Done' : 'Mark done'}
                  </button>
                </div>
              )}
            </li>
          );
        })}

        <li
          className="queue-page__end-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={dropAtEnd}
        />
      </ol>
    </div>
  );
}
