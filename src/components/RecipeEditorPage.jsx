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
  return { key: crypto.randomUUID(), stepid: null, step_name: '', step_duration: null };
}

export default function RecipeEditorPage({ recipe, userId, onCancel, onSave, onDelete }) {
  const [name, setName] = useState(recipe.name || '');
  const [steps, setSteps] = useState([]);
  const [originalStepIds, setOriginalStepIds] = useState([]);
  const [loading, setLoading] = useState(Boolean(recipe.recipeid));
  const [saving, setSaving] = useState(false);
  const [countText, setCountText] = useState('0');
  const [stepErrors, setStepErrors] = useState([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!recipe.recipeid) {
      setLoading(false);
      return;
    }
    let active = true;
    getSteps(recipe.recipeid).then((data) => {
      if (active) {
        const loaded = data.map((s) => ({
          key: s.stepid,
          stepid: s.stepid,
          step_name: s.step_name,
          step_duration: s.step_duration ?? null,
        }));
        setSteps(loaded);
        setCountText(String(loaded.length));
        setOriginalStepIds(data.map((s) => s.stepid));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [recipe.recipeid]);

  const applyStepCount = () => {
    const count = Math.max(0, Math.min(50, Number(countText) || 0));
    setSteps((prev) => {
      if (count === prev.length) return prev;
      if (count > prev.length) {
        const extra = Array.from({ length: count - prev.length }, emptyStep);
        return [...prev, ...extra];
      }
      return prev.slice(0, count);
    });
    setStepErrors([]);
    setFormError('');
  };

  const updateStepField = (index, field, value) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    if (field === 'step_name' && value.trim()) {
      setStepErrors((prev) => (prev[index] ? prev.map((e, i) => (i === index ? false : e)) : prev));
    }
  };

  const removeStepAt = (index) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
    setCountText((prev) => String(Math.max(0, Number(prev) - 1)));
    setStepErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('Recipe name is required.');
      return;
    }
    if (steps.length === 0) {
      setFormError('Add at least one step before saving.');
      return;
    }
    const errors = steps.map((s) => !s.step_name.trim());
    if (errors.some(Boolean)) {
      setStepErrors(errors);
      setFormError('');
      return;
    }
    setStepErrors([]);
    setFormError('');
    setSaving(true);

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
      const duration = step.step_duration ?? 0;
      if (step.stepid) {
        const updated = await updateStep(step.stepid, {
          step_name: step.step_name.trim(),
          step_duration: duration,
        });
        saved.push(updated);
      } else {
        const created = await createStep(recipeId, {
          step_name: step.step_name.trim(),
          step_duration: duration,
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
            onChange={(e) => setCountText(e.target.value)}
          />
        </label>
        <button type="button" className="btn-primary" onClick={applyStepCount}>
          Initiate
        </button>
      </div>

      {formError && <p className="recipe-editor-page__error text-small">{formError}</p>}

      <div className="step-bubbles">
        {steps.map((step, i) => (
          <div key={step.key} className="step-bubble">
            <div className="step-bubble__row">
              <span className="step-bubble__number text-small">{i + 1}</span>
              <input
                className="step-bubble__name"
                placeholder={`Step ${i + 1} name`}
                value={step.step_name}
                onChange={(e) => updateStepField(i, 'step_name', e.target.value)}
              />
              <div className="step-bubble__timer">
                <select
                  className="step-bubble__preset-select"
                  value={[1, 5, 10].includes(step.step_duration / 60) ? String(step.step_duration / 60) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateStepField(i, 'step_duration', val === '' ? null : Number(val) * 60);
                  }}
                >
                  <option value="">No timer</option>
                  <option value="1">1 min</option>
                  <option value="5">5 min</option>
                  <option value="10">10 min</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="step-bubble__custom"
                  placeholder="Custom min"
                  value={step.step_duration === null ? '' : step.step_duration / 60}
                  onChange={(e) => {
                    const raw = e.target.value;
                    updateStepField(
                      i,
                      'step_duration',
                      raw === '' ? null : Math.round(Number(raw) * 60)
                    );
                  }}
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
            {stepErrors[i] && <p className="step-bubble__error text-small">Step name is required.</p>}
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
