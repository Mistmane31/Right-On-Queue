import { supabase } from './supabaseClient';

const inFlightQueues = new Map();

export async function startQueue(recipeId) {
  if (inFlightQueues.has(recipeId)) {
    return inFlightQueues.get(recipeId);
  }

  const promise = (async () => {
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
  })();

  inFlightQueues.set(recipeId, promise);
  try {
    return await promise;
  } finally {
    inFlightQueues.delete(recipeId);
  }
}

export async function getQueue(recipeId) {
  const { data, error } = await supabase
    .from('queue')
    .select('*, steps!inner(*)')
    .eq('steps.recipeid', recipeId)
    .order('queue_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function updateQueueOrder(updates) {
  const results = await Promise.all(
    updates.map(({ queueid, queue_order }) =>
      supabase.from('queue').update({ queue_order }).eq('queueid', queueid)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}

export async function updateQueueTime(queueId, timeRemaining) {
  const { error } = await supabase
    .from('queue')
    .update({ time_remaining: timeRemaining })
    .eq('queueid', queueId);
  if (error) throw error;
}

export async function updateQueueStatus(queueId, status) {
  const { error } = await supabase.from('queue').update({ status }).eq('queueid', queueId);
  if (error) throw error;
}
