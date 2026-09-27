import HomeBar from './HomeBar';

export default function HomePage({ recipes, onOpenRecipe, onCreate, onLogout }) {
  return (
    <div className="home-page">
      <HomeBar title="My Recipes">
        <button type="button" className="btn-primary" onClick={onCreate}>
          Create
        </button>
        <button type="button" className="btn-outline" onClick={onLogout}>
          Logout
        </button>
      </HomeBar>

      {recipes.length === 0 ? (
        <p className="home-page__empty text-small">Welcome! Start to spice by creating your recipe!</p>
      ) : (
        <div className="home-page__grid">
          {recipes.map((r) => (
            <button
              key={r.recipeid}
              type="button"
              className="recipe-card text-heading-1"
              onClick={() => onOpenRecipe(r)}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
