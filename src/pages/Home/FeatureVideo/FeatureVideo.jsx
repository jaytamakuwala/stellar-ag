import { useEffect, useRef, useState } from "react";
import "./FeatureVideo.css";

const loadYTApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (window._ytApiPromise) return window._ytApiPromise;
  window._ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
  return window._ytApiPromise;
};

const getYouTubeId = (input) => {
  try {
    if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
    const u = new URL(input);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    const v = u.searchParams.get("v");
    if (v) return v;
    const m = input.match(/embed\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
  } catch {}
  return "";
};

export default function FeatureYouTube({
  videoUrl = "https://youtu.be/jcrbunv6GTw",
  showPlaylist = false,
}) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null); // <-- unique mount target per instance

  const videoId = getYouTubeId(videoUrl) || "MkNtgoPr-TE";

  useEffect(() => {
    let cancelled = false;
    let player;

    loadYTApi().then(() => {
      if (cancelled || !containerRef.current) return;

      player = new window.YT.Player(containerRef.current, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          enablejsapi: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
          ...(showPlaylist
            ? {
                listType: "playlist",
                list: (() => {
                  try {
                    return (
                      new URL(videoUrl).searchParams.get("list") || undefined
                    );
                  } catch {
                    return undefined;
                  }
                })(),
              }
            : {}),
        },
        events: {
          onStateChange: (e) => {
            const S = window.YT.PlayerState;
            if (e.data === S.PLAYING) setPlaying(true);
            if (e.data === S.PAUSED || e.data === S.ENDED) setPlaying(false);
          },
        },
      });

      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      player?.destroy?.();
    };
  }, [videoId, videoUrl, showPlaylist]);

  return (
    <div
      className="video-wrap feature-video"
      data-playing={playing ? "true" : "false"}
    >
      <div
        ref={containerRef} // <-- no id; YouTube will inject an iframe here
        className="yt-iframe"
        aria-label="YouTube video player"
      />
    </div>
  );
}
