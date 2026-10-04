import { useEffect, useState } from 'react';
import { getSteps } from '../lib/recipesApi';
import { toTitleCase, capitalizeFirst } from '../lib/text';

export default function RecipeCardPage({ recipe, onEdit, onQueue, onDelete }) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

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
      <h1 className="text-main-heading">{toTitleCase(recipe.name)}</h1>

      <div className="recipe-card-page__preview">
        <h2 className="text-heading-1">Preview</h2>
        {loading ? (
          <p className="text-small">Loading steps…</p>
        ) : steps.length === 0 ? (
          <p className="recipe-card-page__empty text-small">No steps yet — hit Edit to add some.</p>
        ) : (
          <ol className="recipe-card-page__steps text-small">
            {steps.slice(0, 5).map((s, i) => (
              <li key={s.stepid}>
                Step {i + 1}: {capitalizeFirst(s.step_name)}
                {s.step_duration > 0 && ` (${Math.round(s.step_duration / 60)}m)`}
              </li>
            ))}
            {steps.length > 5 && <li className="recipe-card-page__more">…</li>}
          </ol>
        )}
      </div>

      {confirmingDelete ? (
        <div className="confirm-delete">
          <p className="text-small">Delete this recipe? This can't be undone.</p>
          <div className="confirm-delete__actions">
            <button type="button" className="btn-cancel" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </button>
            <button type="button" className="btn-danger" onClick={onDelete}>
              Delete permanently
            </button>
          </div>
        </div>
      ) : (
        <div className="recipe-card-page__actions">
          <button type="button" className="btn-outline" onClick={onQueue} disabled={steps.length === 0}>
            Queue
          </button>
          <button type="button" className="btn-primary" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="btn-danger" onClick={() => setConfirmingDelete(true)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
