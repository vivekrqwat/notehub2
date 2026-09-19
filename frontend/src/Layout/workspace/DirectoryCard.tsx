import { Folder, MoreHorizontal, StickyNote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Directory } from "../../Hooks/UseWorkspace";


export function DirectoryCard({ directory }: { directory: Directory }) {
  const navigate = useNavigate();

  return (
    <article
      className={`directory-card card-${directory.accent}`}
      onClick={() => navigate(`/notes/${directory._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          navigate(`/notes/${directory._id}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className="card-visual">
        <span className="visual-icon">
          <Folder size={30} />
        </span>
        <button aria-label={`More options for ${directory.name}`}>
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div className="card-content">
        <div>
          <h3>{directory.name}</h3>
          <p>{directory.description}</p>
        </div>
        <span className="note-count">
          <StickyNote size={14} />
          {directory.notes}
        </span>
      </div>
    </article>
  );
}
