import { ChevronDown, FolderPlus, Search } from "lucide-react";
import { useState } from "react";
import { UseWorkspace } from "../Hooks/UseWorkspace";
import { DirectoryCard } from "../Layout/workspace/DirectoryCard";
import { CreateItemDialog } from "../Layout/workspace/CreateItemDialog";
import { Button } from "../Components/ui/button";


export function DirectoriesPage() {
  const workspace = UseWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createDirectory = async (value: string) => {
    setCreateError(null);

    try {
      await workspace.addDirectory(value);
      setDialogOpen(false);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Could not create directory",
      );
    }
  };

  return (
    <div className="page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Organize your thinking</p>
          <h1>Directories</h1>
          <p className="muted">
            Every idea has a home. Keep your notes close and your mind clear.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <FolderPlus size={17} /> New directory
        </Button>
      </div>
      <div className="toolbar">
        <div className="search-input">
          <Search size={17} />
          <input
            value={workspace.search}
            onChange={(event) => workspace.setSearch(event.target.value)}
            placeholder="Search directories"
          />
        </div>
        <button className="filter-button">
          Recently updated <ChevronDown size={15} />
        </button>
      </div>
      <div className="all-directory-grid">
        {workspace.loading && <p className="muted">Loading directories...</p>}
        {workspace.error && <p className="error-message">{workspace.error}</p>}
        {createError && <p className="error-message">{createError}</p>}
        {workspace.filteredDirectories.map((directory) => (
          <DirectoryCard key={directory.name} directory={directory} />
        ))}
        <button
          className="new-directory-card"
          onClick={() => setDialogOpen(true)}
        >
          <span>
            <FolderPlus size={21} />
          </span>
          <strong>New directory</strong>
          <small>Start a new collection</small>
        </button>
      </div>
      <CreateItemDialog
        kind="directory"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={(value) => void createDirectory(value)}
      />
    </div>
  );
}
