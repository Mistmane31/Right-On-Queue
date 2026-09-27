import { useEffect, useState } from 'react';
import { getSteps } from '../lib/recipesApi';
import HomeBar from './HomeBar';

export default function RecipeCardPage({ recipe, onHome, onEdit, onQueue, onDelete }) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSteps(recipe.recipeid).then((data) => {
      if (active) {
        setSteps(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [recipe.recipeid]);

  return (
    <div className="recipe-card-page">
      <HomeBar title={recipe.name} onHome={onHome} />

      {loading ? (
        <p className="text-small">Loading steps…</p>
      ) : steps.length === 0 ? (
        <p className="recipe-card-page__empty text-small">No steps yet — hit Edit to add some.</p>
      ) : (
        <ol className="recipe-card-page__steps text-small">
          {steps.map((s, i) => (
            <li key={s.stepid}>
              Step {i + 1}: {s.step_name}
              {s.step_duration > 0 && ` (${s.step_duration}s)`}
            </li>
          ))}
        </ol>
      )}

      <div className="recipe-card-page__actions">
        <button type="button" className="btn-primary" onClick={onQueue} disabled={steps.length === 0}>
          Queue
        </button>
        <button type="button" className="btn-outline" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
