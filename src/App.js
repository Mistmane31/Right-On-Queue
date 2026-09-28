import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { getRecipes, deleteRecipe } from './lib/recipesApi';
import { logOut } from './lib/authApi';
import { mockUser } from './lib/mockData';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import RecipeCardPage from './components/RecipeCardPage';
import RecipeEditorPage from './components/RecipeEditorPage';
import QueuePage from './components/QueuePage';
import logo from './assets/roq-logo.png';
import './App.css';

const PREVIEW = process.env.REACT_APP_UI_PREVIEW === 'true';

export default function App() {
  const [session, setSession] = useState(PREVIEW ? { user: mockUser } : undefined);
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('home');
  const [editorOrigin, setEditorOrigin] = useState('create');

  const userId = session?.user?.id;

  useEffect(() => {
    if (PREVIEW) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      getRecipes(userId).then(setRecipes);
    } else {
      setRecipes([]);
      setSelected(null);
      setView('home');
    }
  }, [userId]);

  if (session === undefined) return <p className="app-loading text-small">Checking session…</p>;
  if (!session) return <LoginPage />;

  const refreshRecipes = () => getRecipes(userId).then(setRecipes);

  const handleCreate = () => {
    setSelected({ recipeid: null, name: '' });
    setEditorOrigin('create');
    setView('editor');
  };

  const handleDelete = async (recipeId) => {
    await deleteRecipe(recipeId);
    await refreshRecipes();
    setSelected(null);
    setView('home');
  };

  const handleEditorCancel = () => {
    if (editorOrigin === 'create') {
      setSelected(null);
      setView('home');
    } else {
      setView('recipe');
    }
  };

  return (
    <div className="app">
      {view === 'home' ? (
        <Navbar
          left={<img className="navbar__logo" src={logo} alt="Right On Queue" />}
          right={
            <>
              <button
                type="button"
                className="btn-primary navbar__create"
                aria-label="Create recipe"
                title="Create recipe"
                onClick={handleCreate}
              >
                +
              </button>
              <button type="button" className="btn-outline" onClick={logOut}>
                Logout
              </button>
            </>
          }
        />
      ) : (
        <Navbar
          left={
            <button type="button" className="btn-primary" onClick={() => setView('home')}>
              ← Home
            </button>
          }
        />
      )}

      {view === 'home' && (
        <HomePage
          recipes={recipes}
          onOpenRecipe={(r) => {
            setSelected(r);
            setView('recipe');
          }}
        />
      )}

      {view === 'recipe' && selected && (
        <RecipeCardPage
          recipe={selected}
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
          userId={userId}
          onCancel={handleEditorCancel}
          onSave={async (updatedName, updatedRecipeId) => {
            setSelected((prev) => ({ ...prev, name: updatedName, recipeid: updatedRecipeId }));
            await refreshRecipes();
            setView('recipe');
          }}
          onDelete={() => handleDelete(selected.recipeid)}
        />
      )}

      {view === 'queue' && selected && <QueuePage recipe={selected} />}
    </div>
  );
}