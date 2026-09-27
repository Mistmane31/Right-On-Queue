import { supabase } from './supabaseClient';
import { mockState, nextId } from './mockData';

const PREVIEW = process.env.REACT_APP_UI_PREVIEW === 'true';

export async function getRecipes(userId) {
  if (PREVIEW) return mockState.recipes.filter((r) => r.user_id === userId);
  const { data, error } = await supabase
    .from('recipe')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createRecipe(userId, name) {
  if (PREVIEW) {
    const recipe = {
      recipeid: nextId('r'),
      user_id: userId,
      name,
      created_at: new Date().toISOString(),
    };
    mockState.recipes.unshift(recipe);
    mockState.steps[recipe.recipeid] = [];
    return recipe;
  }
  const { data, error } = await supabase
    .from('recipe')
    .insert({ user_id: userId, name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function renameRecipe(recipeId, name) {
  if (PREVIEW) {
    const recipe = mockState.recipes.find((r) => r.recipeid === recipeId);
    if (recipe) recipe.name = name;
    return;
  }
  const { error } = await supabase.from('recipe').update({ name }).eq('recipeid', recipeId);
  if (error) throw error;
}

export async function deleteRecipe(recipeId) {
  if (PREVIEW) {
    mockState.recipes = mockState.recipes.filter((r) => r.recipeid !== recipeId);
    delete mockState.steps[recipeId];
    delete mockState.queue[recipeId];
    return;
  }
  const { error } = await supabase.from('recipe').delete().eq('recipeid', recipeId);
  if (error) throw error;
}

export async function getSteps(recipeId) {
  if (PREVIEW) return mockState.steps[recipeId] || [];
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('recipeid', recipeId)
    .order('step_number', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createStep(recipeId, step) {
  if (PREVIEW) {
    const list = mockState.steps[recipeId] || (mockState.steps[recipeId] = []);
    const created = {
      stepid: nextId('s'),
      recipeid: recipeId,
      step_number: list.length + 1,
      step_name: step.step_name,
      step_description: step.step_description ?? '',
      step_duration: step.step_duration ?? 0,
    };
    list.push(created);
    return created;
  }
  const { data: existing, error: countErr } = await supabase
    .from('steps')
    .select('step_number')
    .eq('recipeid', recipeId)
    .order('step_number', { ascending: false })
    .limit(1);
  if (countErr) throw countErr;
  const nextNumber = existing.length ? existing[0].step_number + 1 : 1;

  const { data, error } = await supabase
    .from('steps')
    .insert({
      recipeid: recipeId,
      step_number: nextNumber,
      step_name: step.step_name,
      step_description: step.step_description ?? '',
      step_duration: step.step_duration ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStep(stepId, updates) {
  if (PREVIEW) {
    for (const list of Object.values(mockState.steps)) {
      const step = list.find((s) => s.stepid === stepId);
      if (step) {
        Object.assign(step, updates);
        return step;
      }
    }
    return null;
  }
  const { data, error } = await supabase
    .from('steps')
    .update(updates)
    .eq('stepid', stepId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStep(stepId) {
  if (PREVIEW) {
    for (const key of Object.keys(mockState.steps)) {
      mockState.steps[key] = mockState.steps[key].filter((s) => s.stepid !== stepId);
    }
    return;
  }
  const { error } = await supabase.from('steps').delete().eq('stepid', stepId);
  if (error) throw error;
}

export async function reorderSteps(updates) {
  if (PREVIEW) {
    updates.forEach(({ stepid, step_number }) => {
      for (const list of Object.values(mockState.steps)) {
        const step = list.find((s) => s.stepid === stepid);
        if (step) step.step_number = step_number;
      }
    });
    return;
  }
  const results = await Promise.all(
    updates.map(({ stepid, step_number }) =>
      supabase.from('steps').update({ step_number }).eq('stepid', stepid)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}
