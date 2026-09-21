import { Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../../Components/ui/button";
import { Dialog } from "../../Components/ui/dialog";
import { Input } from "../../Components/ui/input";

type Kind = "directory" | "task" | "note";
const copy: Record<Kind, [string, string, string]> = {
  directory: [
    "New directory",
    "Give this collection a name",
    "e.g. Machine learning",
  ],
  task: [
    "New reminder",
    "What should you remember?",
    "e.g. Review the new API notes",
  ],
  note: [
    "New note",
    "What are you thinking about?",
    "e.g. The shape of a good idea",
  ],
};

export function CreateItemDialog({
  kind,
  open,
  onClose,
  onCreate,
}: {
  kind: Kind;
  open: boolean;
  onClose: () => void;
  onCreate: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [heading, description, placeholder] = copy[kind];
  const submit = () => {
    if (!value.trim()) return;
    onCreate(value.trim());
    setValue("");
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="modal-icon">
        <Plus size={21} />
      </div>
      <p className="eyebrow">Make some space</p>
      <h2>{heading}</h2>
      <p className="muted">{description}</p>
      <Input
        autoFocus
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        onKeyDown={(event) => event.key === "Enter" && submit()}
      />
      <div className="modal-actions">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit}>
          Create1 <ArrowRight size={16} />
        </Button>
      </div>
    </Dialog>
  );
}
