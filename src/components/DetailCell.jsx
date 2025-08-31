import { useEffect, useState } from "react";

export function DetailCell({ children, targetHeight }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      className="detail-wrapper"
      style={{
        maxHeight: open ? targetHeight : 0,
        overflow: "hidden",
        transition: "max-height 260ms ease",
      }}
    >
      {children}
    </div>
  );
}