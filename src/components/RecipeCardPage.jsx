import { useEffect, useState } from 'react';
import { getSteps } from '../lib/recipesApi';

export default function RecipeCardPage({ recipe, onEdit, onQueue, onDelete }) {
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
      <h1 className="text-main-heading">{recipe.name}</h1>

      <div className="recipe-card-page__preview">
        <h2 className="text-heading-1">Preview</h2>
        {loading ? (
          <p className="text-small">Loading steps…</p>
        ) : steps.length === 0 ? (
          <p className="recipe-card-page__empty text-small">No steps yet — hit Edit to add some.</p>
        ) : (
          <ol className="recipe-card-page__steps text-small">
            {steps.map((s, i) => (
              <li key={s.stepid}>
                Step {i + 1}: {s.step_name}
                {s.step_duration > 0 && ` (${Math.round(s.step_duration / 60)}m)`}
              </li>
            ))}
          </ol>
        )}
      </div>

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
