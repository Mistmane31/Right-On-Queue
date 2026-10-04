import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { getRecipes, deleteRecipe } from './lib/recipesApi';
import { logOut, getUsername } from './lib/authApi';
import { mockUser } from './lib/mockData';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import TypingText from './components/TypingText';
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
  const [username, setUsername] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('home');
  const [editorOrigin, setEditorOrigin] = useState('create');
  const [loggingOut, setLoggingOut] = useState(false);

  const userId = session?.user?.id;

  useEffect(() => {
    if (PREVIEW) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) setLoggingOut(false);
  }, [session]);

  useEffect(() => {
    if (userId) {
      getRecipes(userId).then(setRecipes);
      getUsername(userId).then(setUsername);
    } else {
      setRecipes([]);
      setUsername('');
      setSelected(null);
      setView('home');
    }
  }, [userId]);

  if (session === undefined) return <p className="app-loading text-small">Checking session…</p>;
  if (loggingOut) return <p className="app-loading text-small">Closing the Cook Book for now…</p>;
  if (!session) return <LoginPage />;

  const refreshRecipes = () => getRecipes(userId).then(setRecipes);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logOut();
  };

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
    <>
      {view === 'home' ? (
        <Navbar
          left={
            <div className="navbar__brand">
              <img className="navbar__logo" src={logo} alt="Right On Queue" />
              {username && <TypingText text={`Welcome Back, ${username}!`} />}
            </div>
          }
          right={
            <>
              <button type="button" className="btn-primary" onClick={handleCreate}>
                Create +
              </button>
              <button type="button" className="btn-outline" onClick={handleLogout}>
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

      <div className="app">
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
    </>
  );
}
