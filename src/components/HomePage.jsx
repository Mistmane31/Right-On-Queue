export default function HomePage({ recipes, onOpenRecipe }) {
  return (
    <div className="home-page">
      <h1 className="text-main-heading">My Recipes</h1>
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
