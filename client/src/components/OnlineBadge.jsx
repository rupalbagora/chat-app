export default function OnlineBadge({ online }) {
  return (
    <span
      className={`online-badge ${online ? "online-badge--online" : "online-badge--offline"}`}
      title={online ? "Online" : "Offline"}
    />
  );
}
