export const mockUser = { id: 'preview-user' };

let idCounter = 100;
export const nextId = (prefix) => `${prefix}${idCounter++}`;

export const mockState = {
  recipes: [
    {
      recipeid: 'r1',
      user_id: 'preview-user',
      name: 'Pan-Seared Salmon',
      created_at: new Date().toISOString(),
    },
    {
      recipeid: 'r2',
      user_id: 'preview-user',
      name: 'Weeknight Carbonara',
      created_at: new Date().toISOString(),
    },
  ],
  steps: {
    r1: [
      {
        stepid: 's1',
        recipeid: 'r1',
        step_number: 1,
        step_name: 'Pat salmon dry, season',
        step_description: 'Salt both sides, let sit 10 minutes.',
        step_duration: 600,
      },
      {
        stepid: 's2',
        recipeid: 'r1',
        step_number: 2,
        step_name: 'Sear skin-side down',
        step_description: "Medium-high heat, don't move it.",
        step_duration: 300,
      },
      {
        stepid: 's3',
        recipeid: 'r1',
        step_number: 3,
        step_name: 'Flip and finish',
        step_description: 'Lower heat, baste with butter.',
        step_duration: 120,
      },
    ],
    r2: [
      {
        stepid: 's4',
        recipeid: 'r2',
        step_number: 1,
        step_name: 'Boil pasta',
        step_description: 'Salt the water well.',
        step_duration: 600,
      },
      {
        stepid: 's5',
        recipeid: 'r2',
        step_number: 2,
        step_name: 'Crisp guanciale',
        step_description: '',
        step_duration: 240,
      },
    ],
  },
  queue: {},
};
