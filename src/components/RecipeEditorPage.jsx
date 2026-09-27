import { useEffect, useState } from 'react';
import {
  getSteps,
  createStep,
  updateStep,
  deleteStep,
  reorderSteps,
  renameRecipe,
} from '../lib/recipesApi';

const emptyDraft = { step_name: '', step_description: '', step_duration: 0 };

export default function RecipeEditorPage({ recipe, onCancel, onSave, onDelete }) {
  const [name, setName] = useState(recipe.name);
  const [steps, setSteps] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
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

  const addStep = async (e) => {
    e.preventDefault();
    if (!draft.step_name.trim()) return;
    const created = await createStep(recipe.recipeid, draft);
    setSteps((prev) => [...prev, created]);
    setDraft(emptyDraft);
  };

  const editField = (stepId, field, value) =>
    setSteps((prev) => prev.map((s) => (s.stepid === stepId ? { ...s, [field]: value } : s)));

  const saveField = (stepId, field, value) => updateStep(stepId, { [field]: value });

  const removeStep = async (stepId) => {
    await deleteStep(stepId);
    setSteps((prev) => prev.filter((s) => s.stepid !== stepId));
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
    await reorderSteps(next.map((s, i) => ({ stepid: s.stepid, step_number: i + 1 })));
  };

  const handleSave = async () => {
    await renameRecipe(recipe.recipeid, name);
    onSave(name);
  };

  if (loading) return <p className="editor-loading">Loading steps…</p>;

  return (
    <div className="recipe-editor-page">
      <input
        className="recipe-editor-page__name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Recipe name"
      />

      <ol className="step-list">
        {steps.map((s, i) => (
          <li key={s.stepid} className="step-list__item">
            <div className="step-list__order">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </button>
              <span>{i + 1}</span>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === steps.length - 1}
              >
                ↓
              </button>
            </div>

            <div className="step-list__fields">
              <input
                className="step-list__name"
                value={s.step_name}
                onChange={(e) => editField(s.stepid, 'step_name', e.target.value)}
                onBlur={(e) => saveField(s.stepid, 'step_name', e.target.value)}
              />
              <textarea
                className="step-list__description"
                value={s.step_description ?? ''}
                onChange={(e) => editField(s.stepid, 'step_description', e.target.value)}
                onBlur={(e) => saveField(s.stepid, 'step_description', e.target.value)}
                placeholder="Description (optional)"
              />
              <label className="step-list__duration">
                Duration (sec)
                <input
                  type="number"
                  min="0"
                  value={s.step_duration ?? 0}
                  onChange={(e) => editField(s.stepid, 'step_duration', Number(e.target.value))}
                  onBlur={(e) => saveField(s.stepid, 'step_duration', Number(e.target.value))}
                />
              </label>
            </div>

            <button
              type="button"
              className="step-list__remove"
              aria-label={`Remove ${s.step_name}`}
              onClick={() => removeStep(s.stepid)}
            >
              ✕
            </button>
          </li>
        ))}
      </ol>

      <form className="step-list__new" onSubmit={addStep}>
        <input
          placeholder="Step name"
          value={draft.step_name}
          onChange={(e) => setDraft({ ...draft, step_name: e.target.value })}
        />
        <input
          placeholder="Description (optional)"
          value={draft.step_description}
          onChange={(e) => setDraft({ ...draft, step_description: e.target.value })}
        />
        <input
          type="number"
          min="0"
          placeholder="Duration (sec)"
          value={draft.step_duration}
          onChange={(e) => setDraft({ ...draft, step_duration: Number(e.target.value) })}
        />
        <button type="submit">Add step</button>
      </form>

      <div className="recipe-editor-page__actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
