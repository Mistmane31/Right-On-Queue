import { useEffect, useState } from 'react';
import {
  getSteps,
  createStep,
  updateStep,
  deleteStep,
  reorderSteps,
  createRecipe,
  renameRecipe,
} from '../lib/recipesApi';

function emptyStep() {
  return { key: crypto.randomUUID(), stepid: null, step_name: '', step_duration: 300 };
}

export default function RecipeEditorPage({ recipe, userId, onCancel, onSave, onDelete }) {
  const [name, setName] = useState(recipe.name || '');
  const [steps, setSteps] = useState([]);
  const [originalStepIds, setOriginalStepIds] = useState([]);
  const [loading, setLoading] = useState(Boolean(recipe.recipeid));
  const [saving, setSaving] = useState(false);
  const [countText, setCountText] = useState('0');

  useEffect(() => {
    setCountText(String(steps.length));
  }, [steps.length]);

  useEffect(() => {
    if (!recipe.recipeid) {
      setLoading(false);
      return;
    }
    let active = true;
    getSteps(recipe.recipeid).then((data) => {
      if (active) {
        setSteps(
          data.map((s) => ({
            key: s.stepid,
            stepid: s.stepid,
            step_name: s.step_name,
            step_duration: s.step_duration ?? 0,
          }))
        );
        setOriginalStepIds(data.map((s) => s.stepid));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [recipe.recipeid]);

  const setStepCount = (n) => {
    const count = Math.max(0, Math.min(50, Number.isNaN(n) ? 0 : n));
    setSteps((prev) => {
      if (count === prev.length) return prev;
      if (count > prev.length) {
        const extra = Array.from({ length: count - prev.length }, emptyStep);
        return [...prev, ...extra];
      }
      return prev.slice(0, count);
    });
  };

  const updateStepField = (index, field, value) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const removeStepAt = (index) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const trimmedName = name.trim() || 'Untitled Recipe';
    let recipeId = recipe.recipeid;

    if (!recipeId) {
      const created = await createRecipe(userId, trimmedName);
      recipeId = created.recipeid;
    } else {
      await renameRecipe(recipeId, trimmedName);
      const keptIds = steps.filter((s) => s.stepid).map((s) => s.stepid);
      const removedIds = originalStepIds.filter((id) => !keptIds.includes(id));
      await Promise.all(removedIds.map((id) => deleteStep(id)));
    }

    const saved = [];
    for (const step of steps) {
      if (step.stepid) {
        const updated = await updateStep(step.stepid, {
          step_name: step.step_name,
          step_duration: step.step_duration,
        });
        saved.push(updated);
      } else {
        const created = await createStep(recipeId, {
          step_name: step.step_name,
          step_duration: step.step_duration,
          step_description: '',
        });
        saved.push(created);
      }
    }
    if (saved.length) {
      await reorderSteps(saved.map((s, i) => ({ stepid: s.stepid, step_number: i + 1 })));
    }

    setSaving(false);
    onSave(trimmedName, recipeId);
  };

  if (loading) return <p className="text-small">Loading steps…</p>;

  return (
    <div className="recipe-editor-page">
      <div className="recipe-editor-page__top">
        <input
          className="recipe-editor-page__name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe name"
        />
        <label className="recipe-editor-page__count text-small">
          Steps
          <input
            type="number"
            min="0"
            max="50"
            value={countText}
            onChange={(e) => {
              setCountText(e.target.value);
              if (e.target.value !== '') setStepCount(Number(e.target.value));
            }}
          />
        </label>
      </div>

      <div className="step-bubbles">
        {steps.map((step, i) => (
          <div key={step.key} className="step-bubble">
            <span className="step-bubble__number text-small">{i + 1}</span>
            <input
              className="step-bubble__name"
              placeholder={`Step ${i + 1} name`}
              value={step.step_name}
              onChange={(e) => updateStepField(i, 'step_name', e.target.value)}
            />
            <div className="step-bubble__timer">
              {[1, 5, 10].map((m) => (
                <button
                  type="button"
                  key={m}
                  className={`step-bubble__preset ${step.step_duration === m * 60 ? 'is-active' : ''}`}
                  onClick={() => updateStepField(i, 'step_duration', m * 60)}
                >
                  {m}m
                </button>
              ))}
              <input
                type="number"
                min="0"
                step="0.5"
                className="step-bubble__custom"
                value={step.step_duration / 60}
                onChange={(e) =>
                  updateStepField(i, 'step_duration', Math.round(Number(e.target.value) * 60))
                }
              />
            </div>
            <button
              type="button"
              className="step-bubble__remove"
              aria-label={`Remove step ${i + 1}`}
              onClick={() => removeStepAt(i)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="recipe-editor-page__actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        {recipe.recipeid && (
          <button type="button" className="btn-danger" onClick={onDelete} disabled={saving}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
