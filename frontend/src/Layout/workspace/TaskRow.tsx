import { Check, Clock3, MoreHorizontal } from "lucide-react";
import type { Task } from "../../Hooks/UseWorkspace";


export function TaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) {
  return (
    <div className={`task-row ${task.done ? "task-done" : ""}`}>
      <button
        className={`task-check check-${task.color}`}
        onClick={onToggle}
        aria-label="Mark task complete"
      >
        {task.done && <Check size={13} />}
      </button>
      <div>
        <strong>{task.title}</strong>
        <span>
          <Clock3 size={13} />
          {task.date} <i /> {task.time}
        </span>
      </div>
      <button className="more-button" aria-label="More task options">
        <MoreHorizontal size={17} />
      </button>
    </div>
  );
}
