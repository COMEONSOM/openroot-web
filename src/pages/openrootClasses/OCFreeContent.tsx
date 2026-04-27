// ============================================================
// FREE CONTENT SECTION
// VERSION 2025.10 (Scrollable + Expand View)
// ============================================================

import { useState, useRef } from "react";
import "../openrootClasses/OCStyle/OCFreeContent.css";

import e1Thumbnail from "../../assets-oc/e1.avif";
import e2Thumbnail from "../../assets-oc/e2.avif";
import e3Thumbnail from "../../assets-oc/e3.avif";
import e4Thumbnail from "../../assets-oc/e4.avif";
import e5Thumbnail from "../../assets-oc/e5.avif";
import e6Thumbnail from "../../assets-oc/e6.avif";
import e7Thumbnail from "../../assets-oc/e7.avif";

// ============================================================
// TYPES
// ============================================================

interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
}

// ============================================================
// DATA
// ============================================================

const VIDEOS: Video[] = [
  { id: 1, title: "GDrive Auto File Renaming",     url: "https://youtu.be/2tqbwlV0aw0", thumbnail: e1Thumbnail },
  { id: 2, title: "Suno AI Full Tutorial",         url: "https://youtu.be/vLuRuZFAPmk", thumbnail: e2Thumbnail },
  { id: 3, title: "Google Antigravity IDE",        url: "https://youtu.be/EMM0RmkZzhA", thumbnail: e3Thumbnail },
  { id: 4, title: "Building an Electron App",      url: "https://youtu.be/S_uSCuhMeok", thumbnail: e4Thumbnail },
  { id: 5, title: "Deep Research using ChatGPT",   url: "https://youtu.be/324K9jUF8tQ", thumbnail: e5Thumbnail },
  { id: 6, title: "Image to Cinematic Video",      url: "https://youtu.be/d3JtfTJ-uVY", thumbnail: e6Thumbnail },
  { id: 7, title: "High-CTR Thumbnails Using FLOW",url: "https://youtu.be/39zIVpJhCSU", thumbnail: e7Thumbnail },
  
];

// ============================================================
// SUB-COMPONENT: VIDEO CARD
// ============================================================

interface VideoCardProps {
  video: Video;
  lazy?: boolean;
}

const VideoCard = ({ video, lazy = true }: VideoCardProps) => (
  <div className="video-card">
    <div className="thumbnail-container">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="video-thumbnail"
        loading={lazy ? "lazy" : "eager"}
      />
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="video-overlay"
        aria-label={`Watch "${video.title}" on YouTube`}
      >
        <div className="video-play-button" />
      </a>
    </div>
    <h3>{video.title}</h3>
  </div>
);

// ============================================================
// COMPONENT
// ============================================================

const FreeContent = (): React.JSX.Element => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="free-content-wrapper">
      <section id="free-content" className="free-content-container">
        {!expanded ? (
          <>
            <h2>💎 Free Contents</h2>

            <div className="scroll-wrapper">
              <div className="video-scroll-container" ref={scrollRef}>
                {VIDEOS.map((video) => (
                  <VideoCard key={video.id} video={video} lazy />
                ))}

                {/* View All Button */}
                <div
                  className="view-all-card"
                  onClick={() => setExpanded(true)}
                  role="button"
                  tabIndex={0}
                  aria-label="View all free content"
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === "Enter" || e.key === " ") setExpanded(true);
                  }}
                >
                  ➤
                  <span>View All</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="expanded-view">
            <button
              className="back-btn"
              onClick={() => setExpanded(false)}
              aria-label="Back to scroll view"
            >
              ← Back
            </button>

            <div className="expanded-grid">
              {VIDEOS.map((video) => (
                <VideoCard key={video.id} video={video} lazy={false} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default FreeContent;