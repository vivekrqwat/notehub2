import { Folder, LoaderCircle, StickyNote, Trash2 } from "lucide-react";
import { UseWorkspace, type Directory } from "../../Hooks/UseWorkspace";
import { useState } from "react";
import { Button } from "../../Components/ui/button";
import { Dialog } from "../../Components/ui/dialog";
import { useNavigate } from "react-router-dom";

export function DirectoryCard({ directory }: { directory: Directory }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { deleteDir } = UseWorkspace();
const navigate=useNavigate()
  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteDir(directory._id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete directory",
      );
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <article
      className={`directory-card card-${directory.accent}`}
      onClick={() =>{
       
         
               navigate(`/notes/${directory._id}`)
             
        
       }
      }
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
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${directory.name}`}
          onClick={(e) => {
            e.stopPropagation()

            setDeleteError(null);
            setIsDeleteDialogOpen(true);
          }}
        >
          <Trash2 size={17} />
        </Button>
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
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          
          
          if (!isDeleting) setIsDeleteDialogOpen(false);
        }}
      >
        <div className="modal-icon"><Trash2 size={21} /></div>
        <p className="eyebrow">Delete directory</p>
        <h2>Are you sure?</h2>
        <p className="muted">
          This will permanently delete {directory.name} and its notes.
        </p>
        {deleteError && <p className="error-message">{deleteError}</p>}
        <div className="modal-actions">
          <Button
            type="button"
            variant="ghost"
            disabled={isDeleting}
            onClick={(e) => {
           e.stopPropagation()
              setIsDeleteDialogOpen(false)}}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={(e) => void confirmDelete(e)}
          >
            {isDeleting && <LoaderCircle className="delete-spinner" size={15} />}
            {isDeleting ? "Deleting..." : "Delete directory"}
          </Button>
        </div>
      </Dialog>
    </article>
  );
}
