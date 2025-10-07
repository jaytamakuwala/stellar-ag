import React, { useState, Suspense, useEffect } from "react";
import func from "@/assets/videos/mov.mp4";
import { useResponsive } from "../../hooks/useResponsive";

// Lazy-load the heavy interactive part
const DashboardDemo2 = React.lazy(() => import("./Demo3"));

export default function HoverToActivate() {
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [prefetched, setPrefetched] = useState(false);
  const leaveTimer = React.useRef(null);
  const { isMobile, isTablet } = useResponsive();

  const prefetch = () => {
    if (!prefetched) {
      setPrefetched(true);
      // Start loading the interactive chunk; once loaded, keep it mounted
      import("./Demo3")
        .then(() => setReady(true))
        .catch(() => {});
    }
  };

  const activate = () => {
    prefetch();
    clearTimeout(leaveTimer.current);
    setActive(true);
  };
  //   const deactivate = () => setActive(false);

  const deactivate = () => {
    // Small debounce to prevent jitter when pointer hits edges/scrollbar
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setActive(false), 80);
  };

  const onBlur = (e) => {
    // Only deactivate if focus actually leaves the container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      deactivate();
    }
  };

  return isMobile ? (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="hero-video"
      style={{ marginTop: "1px", marginLeft: "3px" }}
    >
      <source src={func} type="video/mp4" />
    </video>
  ) : (
    <div
      className="stock-image stock-image-3 demo"
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={onBlur}
      onTouchStart={() => setActive((a) => !a)} // tap to toggle on mobile
      role="region"
      aria-label="Interactive demo"
      style={{ width: !active && "unset" }}
    >
      {!active ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="hero-video"
          style={{ marginTop: "1px", marginLeft: "3px" }}
        >
          <source src={func} type="video/mp4" />
        </video>
      ) : (
        <Suspense fallback={null}>
          <DashboardDemo2 />
        </Suspense>
      )}
    </div>
  );
}
