import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { getRecipes, createRecipe, deleteRecipe } from './lib/recipesApi';
import { logOut } from './lib/authApi';
import { mockUser } from './lib/mockData';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RecipeCardPage from './components/RecipeCardPage';
import RecipeEditorPage from './components/RecipeEditorPage';
import QueuePage from './components/QueuePage';
import './App.css';

const PREVIEW = process.env.REACT_APP_UI_PREVIEW === 'true';

export default function App() {
  const [session, setSession] = useState(PREVIEW ? { user: mockUser } : undefined);
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('home');
  const [editorOrigin, setEditorOrigin] = useState('create');

  useEffect(() => {
    if (PREVIEW) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      getRecipes(session.user.id).then(setRecipes);
      setView('home');
    }
  }, [session]);

  if (session === undefined) return <p className="app-loading text-small">Checking session…</p>;
  if (!session) return <LoginPage />;

  const refreshRecipes = () => getRecipes(session.user.id).then(setRecipes);

  const handleCreate = async () => {
    const recipe = await createRecipe(session.user.id, 'New Recipe');
    setRecipes((prev) => [recipe, ...prev]);
    setSelected(recipe);
    setEditorOrigin('create');
    setView('editor');
  };

  const handleDelete = async (recipeId) => {
    await deleteRecipe(recipeId);
    await refreshRecipes();
    setSelected(null);
    setView('home');
  };

  const handleEditorCancel = async () => {
    if (editorOrigin === 'create') {
      await deleteRecipe(selected.recipeid);
      await refreshRecipes();
      setSelected(null);
      setView('home');
    } else {
      setView('recipe');
    }
  };

  return (
    <div className="app">
      {view === 'home' && (
        <HomePage
          recipes={recipes}
          onCreate={handleCreate}
          onLogout={logOut}
          onOpenRecipe={(r) => {
            setSelected(r);
            setView('recipe');
          }}
        />
      )}

      {view === 'recipe' && selected && (
        <RecipeCardPage
          recipe={selected}
          onHome={() => setView('home')}
          onEdit={() => {
            setEditorOrigin('edit');
            setView('editor');
          }}
          onQueue={() => setView('queue')}
          onDelete={() => handleDelete(selected.recipeid)}
        />
      )}

      {view === 'editor' && selected && (
        <RecipeEditorPage
          recipe={selected}
          onCancel={handleEditorCancel}
          onSave={async (updatedName) => {
            setSelected((prev) => ({ ...prev, name: updatedName }));
            await refreshRecipes();
            setView('recipe');
          }}
          onDelete={() => handleDelete(selected.recipeid)}
        />
      )}

      {view === 'queue' && selected && (
        <QueuePage recipe={selected} onBack={() => setView('recipe')} />
      )}
    </div>
  );
}
