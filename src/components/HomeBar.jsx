export default function HomeBar({ title, onHome, children }) {
  return (
    <div className="home-bar">
      {onHome && (
        <button type="button" className="home-bar__home" onClick={onHome}>
          ← Home
        </button>
      )}
      <h1 className="home-bar__title text-main-heading">{title}</h1>
      {children && <div className="home-bar__actions">{children}</div>}
    </div>
  );
}
