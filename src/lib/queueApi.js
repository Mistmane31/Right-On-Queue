import { supabase } from './supabaseClient';
import { mockState, nextId } from './mockData';

const PREVIEW = process.env.REACT_APP_UI_PREVIEW === 'true';

export async function startQueue(recipeId) {
  if (PREVIEW) {
    const steps = (mockState.steps[recipeId] || [])
      .slice()
      .sort((a, b) => a.step_number - b.step_number);
    const rows = steps.map((s, i) => ({
      queueid: nextId('q'),
      stepid: s.stepid,
      queue_order: i,
      time_remaining: s.step_duration ?? 0,
      status: 'pending',
      steps: s,
    }));
    mockState.queue[recipeId] = rows;
    return rows;
  }
  const { data: steps, error: stepsErr } = await supabase
    .from('steps')
    .select('*')
    .eq('recipeid', recipeId)
    .order('step_number', { ascending: true });
  if (stepsErr) throw stepsErr;

  const stepIds = steps.map((s) => s.stepid);
  if (stepIds.length) {
    const { error: clearErr } = await supabase.from('queue').delete().in('stepid', stepIds);
    if (clearErr) throw clearErr;
  }
  if (!steps.length) return [];

  const rows = steps.map((s, i) => ({
    stepid: s.stepid,
    queue_order: i,
    time_remaining: s.step_duration ?? 0,
    status: 'pending',
  }));

  const { data, error } = await supabase.from('queue').insert(rows).select();
  if (error) throw error;
  return data;
}

export async function getQueue(recipeId) {
  if (PREVIEW) return mockState.queue[recipeId] || [];
  const { data, error } = await supabase
    .from('queue')
    .select('*, steps!inner(*)')
    .eq('steps.recipeid', recipeId)
    .order('queue_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function updateQueueOrder(updates) {
  if (PREVIEW) {
    for (const rows of Object.values(mockState.queue)) {
      updates.forEach(({ queueid, queue_order }) => {
        const row = rows.find((r) => r.queueid === queueid);
        if (row) row.queue_order = queue_order;
      });
    }
    return;
  }
  const results = await Promise.all(
    updates.map(({ queueid, queue_order }) =>
      supabase.from('queue').update({ queue_order }).eq('queueid', queueid)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}

export async function updateQueueTime(queueId, timeRemaining) {
  if (PREVIEW) {
    for (const rows of Object.values(mockState.queue)) {
      const row = rows.find((r) => r.queueid === queueId);
      if (row) row.time_remaining = timeRemaining;
    }
    return;
  }
  const { error } = await supabase
    .from('queue')
    .update({ time_remaining: timeRemaining })
    .eq('queueid', queueId);
  if (error) throw error;
}

export async function updateQueueStatus(queueId, status) {
  if (PREVIEW) {
    for (const rows of Object.values(mockState.queue)) {
      const row = rows.find((r) => r.queueid === queueId);
      if (row) row.status = status;
    }
    return;
  }
  const { error } = await supabase.from('queue').update({ status }).eq('queueid', queueId);
  if (error) throw error;
}
