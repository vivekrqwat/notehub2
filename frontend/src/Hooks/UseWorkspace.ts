import { useEffect, useMemo, useState } from "react";
import { UseAuth } from "../Context/Useauth"
import { useWorkspaceStore } from "../store/WorkSpaceStore";
import type { Task as ApiTask } from "../lib/api";

export type Directory = {
  _id: string;
  name: string;
  uid: string;
  notes?: number;
  description?: string;
  accent?: "lime" | "sky" | "peach" | "ink";
};

export type Task = {
  _id?: string;
  title: string;
  desc: string;
  date: string;
  time: string;
  color: "lime" | "sky" | "peach";
  done?: boolean;
};
export const UseWorkspace=()=>{
    const {user}=UseAuth();
      const notes = useWorkspaceStore((state) => state.notes);
    const directoriesFromStore=useWorkspaceStore((state)=>(state.directories))
    const loadDirectories=useWorkspaceStore((state)=>(state.loadDirectories))
    const addDirectoryToStore = useWorkspaceStore((state) => state.addDirectory);
    const loading = useWorkspaceStore((state) => state.loading);
  const error = useWorkspaceStore((state) => state.error);
  const deleteDir=useWorkspaceStore((state)=>(state.DeleteDir))
    const [search, setSearch] = useState("");
  const tasks = useWorkspaceStore((state) => state.tasks);
  const loadTasks = useWorkspaceStore((state) => state.loadTasks);
  const addTaskToStore = useWorkspaceStore((state) => state.addTask);

    console.log(user,"useworkspace")
  useEffect(()=>{
    if (user?.id) {
        console.log("user",user.id)
      void loadDirectories(user.id);
      void loadTasks(user.id);
    }


  },[loadDirectories, loadTasks, user?.id])


    const directories = directoriesFromStore.map((directory, index) => ({
    ...directory,
    notes: notes.filter((note) => note.dirid === directory._id).length,
    description: "A fresh space for your next collection.",
    accent: (["lime", "sky", "peach", "ink"] as const)[index % 4],
  }));

    const addDirectory = async (name: string) => {
    if (!user?.id) {
      throw new Error("You must log in before creating a directory.");
    }

    await addDirectoryToStore(name, user.id);
  };

  const filteredDirectories = useMemo(
    () =>
      directories.filter((directory) =>
        directory.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [directories, search],
  );

  const addTask = async (task: Omit<ApiTask, "_id">) => {
    await addTaskToStore(task);
  };


 

  return{
    loading,
    error,
    notes,
    directories,
    loadDirectories,
    addDirectory,
    deleteDir,
  
    filteredDirectories,
    totalNotes: notes.length,
    setSearch,
    search
    ,tasks
    ,addTask
  }
    
}