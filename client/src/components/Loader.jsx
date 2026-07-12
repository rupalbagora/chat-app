export default function Loader({ size = "md" }) {
  return <div className={`loader loader--${size}`} aria-label="Loading" />;
}
