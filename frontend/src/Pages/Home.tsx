import { ArrowRight, FolderPlus, Plus } from "lucide-react";
import { useState } from "react";


import { Link } from "react-router-dom";
import { UseWorkspace } from "../Hooks/UseWorkspace";
import { Button } from "../Components/ui/button";
import { DirectoryCard } from "../Layout/workspace/DirectoryCard";
// import { TaskRow } from "../Layout/workspace/TaskRow";
import { CreateItemDialog } from "../Layout/workspace/CreateItemDialog";
import { ReminderSidebar } from "../Layout/workspace/ReminderSidebar";
import { UseAuth } from "../Context/Useauth";

export function HomePage() {
  const workspace = UseWorkspace();
  const [dialog, setDialog] = useState<"directory" | "task" | "note" | null>(
    null,
  );
  const { user } = UseAuth();
  const hour = new Date().getHours();
  const timeTheme =
    hour >= 5 && hour < 12
      ? "morning"
      : hour >= 12 && hour < 18
        ? "evening"
        : "night";
  const greeting =
    timeTheme === "morning"
      ? "Good morning"
      : timeTheme === "evening"
        ? "Good evening"
        : "Good night";
  const displayName = user?.email?.split("@")[0] ?? "there";

  return (
    <div className={`page page-home theme-${timeTheme}`}>
      <section className="hero-copy">
        <div>
          <p className="eyebrow">
            {new Date().toLocaleDateString("en-US")} <span className="eyebrow-dot" />
          </p>
          <h1>
            {greeting}
            <br />
            <em>{displayName}</em>
          </h1>
          <p className="hero-description">
            A clear mind starts with a clear place
            <br className="desktop-only" /> for your best ideas.
          </p>
        </div>
        <div className="hero-actions">
          <Button onClick={() => setDialog("note")}>
            <Plus size={17} /> New note
          </Button>
          <Button variant="outline" onClick={() => setDialog("directory")}>
            <FolderPlus size={17} /> Directory
          </Button>
        </div>
      </section>
      <section className="stats-row">
        <div>
          <span className="stat-label">Total notes</span>
          <strong>{workspace.totalNotes}</strong>
          <span className="stat-change">+8 this month</span>
        </div>
        <div>
          <span className="stat-label">Directories</span>
          <strong>{workspace.directories.length}</strong>
          <span className="stat-change">2 updated today</span>
        </div>
        {/* <div>
          <span className="stat-label">Tasks due</span>
          <strong>{workspace.tasks.length}</strong>
          <span className="stat-change">Stay on track</span>
        </div> */}
        <div className="streak-stat">
          <span className="stat-label">Current streak</span>
          <strong>
            07 <small>days</small>
          </strong>
          <span className="stat-change">
            Keep it going <span className="fire">✦</span>
          </span>
        </div>
      </section>
      <section className="content-grid">
        <div className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your spaces</p>
              <h2>
                Directories <span>{workspace.directories.length}</span>
              </h2>
            </div>
            <Link className="text-button" to="/directories">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="directory-grid">
            {workspace.directories.map((directory) => (
              <DirectoryCard key={directory.name} directory={directory}  />
            ))}
            <button
              className="new-directory-card"
              onClick={() => setDialog("directory")}
            >
              <span>
                <Plus size={21} />
              </span>
              <strong>New directory</strong>
              <small>Start a new collection</small>
            </button>
          </div>
        </div>
        <ReminderSidebar />
      </section>
      <CreateItemDialog
        kind={dialog ?? "note"}
        open={dialog !== null}
        onClose={() => setDialog(null)}
        onCreate={(value) => {
          if (dialog === "directory") workspace.addDirectory(value);
        //   if (dialog === "task") workspace.addTask(value);
          setDialog(null);
        }}
      />
    </div>
  );
}
