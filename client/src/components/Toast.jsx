export default function Toast({ item }) {
  if (!item.message) return null;

  return (
    <div className={`toast ${item.kind || "success"}`}>
      <span className="toast-dot" />
      <span>{item.message}</span>
    </div>
  );
}
