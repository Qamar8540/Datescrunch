export default function StatusBanner({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const styles =
    type === "success"
      ? "bg-olive/10 text-olive"
      : "bg-rust/10 text-rust";

  return (
    <p role={type === "error" ? "alert" : undefined} className={`rounded-card px-3 py-2 text-sm ${styles}`}>
      {message}
    </p>
  );
}
