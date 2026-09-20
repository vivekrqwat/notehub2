import { Bell, CalendarDays, Clock3, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../Components/ui/button";
import { Dialog } from "../../Components/ui/dialog";
import { Input } from "../../Components/ui/input";
import { UseAuth } from "../../Context/Useauth";
import { UseWorkspace } from "../../Hooks/UseWorkspace";
import type { Task } from "../../lib/api";

const MAX_DESCRIPTION_WORDS = 500;

function wordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function formatDate(value: string) {
  if (!value) return "No date";
  const dateValue = value.includes("/")
    ? (() => {
        const [day, month, year] = value.split("/");
        return `20${year}-${month}-${day}`;
      })()
    : value;
  const date = new Date(`${dateValue}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateForApi(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year.slice(-2)}`;
}

export function ReminderSidebar() {
  const { user } = UseAuth();
  const { tasks, addTask } = UseWorkspace();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedTasks = useMemo(
    () => [...tasks].sort((first, second) => `${first.Date}${first.time}`.localeCompare(`${second.Date}${second.time}`)),
    [tasks],
  );

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setDate("");
    setTime("");
    setError(null);
  };

  const submitTask = async () => {
    if (!user?.id || !user.email || !title.trim() || !desc.trim() || !date || !time) {
      setError("Add a title, description, date, and time to create a reminder.");
      return;
    }
    if (wordCount(desc) > MAX_DESCRIPTION_WORDS) {
      setError(`Description must be ${MAX_DESCRIPTION_WORDS} words or fewer.`);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await addTask({ title: title.trim(), desc: desc.trim(), Date: formatDateForApi(date), time, email: user.email, uid: user.id });
      resetForm();
      setIsCreateOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not create reminder.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside className="reminder-sidebar" aria-label="Reminders">
      <div className="reminder-sidebar-heading">
        <div>
          <p className="eyebrow">Stay on track</p>
          <h2>Reminders <span>{tasks.length}</span></h2>
        </div>
        <Button type="button" size="icon-sm" aria-label="Add reminder" onClick={() => setIsCreateOpen(true)}>
          <Plus size={17} />
        </Button>
      </div>
      <div className="reminder-list">
        {sortedTasks.length === 0 ? (
          <div className="reminder-empty">
            <Bell size={20} />
            <strong>Your list is clear</strong>
            <span>Add a reminder for something worth remembering.</span>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <button className="reminder-card" key={task._id ?? `${task.title}-${task.Date}-${task.time}`} type="button" onClick={() => setSelectedTask(task)}>
              <span className="reminder-card-mark" />
              <span className="reminder-card-copy">
                <strong>{task.title}</strong>
                <small><CalendarDays size={12} /> {formatDate(task.Date)} <i /> <Clock3 size={12} /> {task.time || "Any time"}</small>
              </span>
            </button>
          ))
        )}
      </div>

      <Dialog open={isCreateOpen} onClose={() => !isSaving && setIsCreateOpen(false)}>
        <div className="modal-icon"><Bell size={21} /></div>
        <p className="eyebrow">Stay on track</p>
        <h2>New reminder</h2>
        <p className="muted">Give your future self a useful nudge.</p>
        <div className="reminder-form">
          <Input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Reminder title" />
          <textarea value={desc} onChange={(event) => setDesc(event.target.value)} placeholder="What should you remember?" maxLength={5000} rows={5} />
          <div className="reminder-date-fields">
            <label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <label>Time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
          </div>
          <small className={`word-counter ${wordCount(desc) > MAX_DESCRIPTION_WORDS ? "is-over" : ""}`}>{wordCount(desc)} / {MAX_DESCRIPTION_WORDS} words</small>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="modal-actions">
          <Button type="button" variant="ghost" disabled={isSaving} onClick={() => setIsCreateOpen(false)}>Cancel</Button>
          <Button type="button" disabled={isSaving} onClick={() => void submitTask()}>{isSaving ? "Saving..." : "Add reminder"} <Plus size={16} /></Button>
        </div>
      </Dialog>

      <Dialog open={selectedTask !== null} onClose={() => setSelectedTask(null)}>
        {selectedTask && (
          <>
            <div className="modal-icon"><Bell size={21} /></div>
            <p className="eyebrow">Reminder</p>
            <h2>{selectedTask.title}</h2>
            <p className="reminder-detail-date"><CalendarDays size={15} /> {formatDate(selectedTask.Date)} <i /> <Clock3 size={15} /> {selectedTask.time || "Any time"}</p>
            <p className="reminder-description">{selectedTask.desc}</p>
            <div className="modal-actions"><Button type="button" variant="ghost" onClick={() => setSelectedTask(null)}><X size={15} /> Close</Button></div>
          </>
        )}
      </Dialog>
    </aside>
  );
}
