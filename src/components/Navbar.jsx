export default function Navbar({ left, right }) {
  return (
    <div className="navbar">
      <div className="navbar__left">{left}</div>
      {right && <div className="navbar__actions">{right}</div>}
    </div>
  );
}
