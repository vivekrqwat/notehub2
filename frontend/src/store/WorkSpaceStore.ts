import { create } from "zustand";
import { api, dataApi, type ApiDirectory, type ApiNote, type NotesPageResponse, type Task } from "../lib/api";

type WorkspaceState = {
  directories: ApiDirectory[];
  notes: ApiNote[];
  notesPagination: NotesPageResponse["pagination"] | null;
  loading: boolean;
  error: string | null;
  loadDirectories: (userId: string) => Promise<void>;
  loadNotes: (directoryId: string, page: string) => Promise<void>;
  addDirectory: (name: string, userId: string) => Promise<void>;
  addNote: (
    directoryId: string,
    note: Pick<ApiNote, "title" | "desc" | "uid">,
  ) => Promise<void>;
  removeNote: (noteId: string, token: string) => Promise<void>;
  EditNotes:(noteId:string,message:ApiNote)=>Promise<void>,
  DeleteDir:(dirid:string)=>Promise<void>,
  tasks: Task[];
  loadTasks: (userId: string, page?: string) => Promise<void>;
  addTask: (task: Omit<Task, "_id">) => Promise<void>;

};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  directories: [],
  notes: [],
  notesPagination: null,
  loading: false,
  error: null,
  tasks: [],
  loadDirectories: async (userId) => {
    set({ loading: true, error: null });
    try {
      set({
        directories: await dataApi.getDirectories(userId),
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Could not load directories",
        loading: false,
      });
    }
  },
  loadNotes: async (directoryId,page) => {
    set({ loading: true, error: null });
    try {
      const result = await dataApi.getNotes(directoryId, page);
      set({ notes: result.items, notesPagination: result.pagination, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Could not load notes",
        loading: false,
      });
    }
  },
  addDirectory: async ( name,userId) => {
    set({ loading: true, error: null });

    try {
      await api.CreateDirectories(name, userId);
      await useWorkspaceStore.getState().loadDirectories(userId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create directory";

      set({ error: message, loading: false });
      throw error;
    }
  },
  addNote: async (directoryId, note) => {
    set({ loading: true, error: null });

    try {
      const created = await api.CreateNotes(directoryId, note);
      set((state) => ({
        notes: [created, ...state.notes],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Could not create note",
        loading: false,
      });
      throw error;
    }
  },
  removeNote: async (noteId) => {
    await api.deleteNote(noteId);
    set((state) => ({
      notes: state.notes.filter((note) => note._id !== noteId),
    }));
  },
  DeleteDir:async(dirid)=>{
   
      await dataApi.deleteDir(dirid)
    set((state)=>({
      directories:state.directories.filter((dir)=>dir._id !==dirid),
    }))

   
  },
  loadTasks: async (userId, page = "1") => {
    try {
      const tasks = await api.GetTask(userId, page, "50");
      set({ tasks });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Could not load reminders" });
    }
  },
  addTask: async (task) => {
    try {
      const created = await api.CreateTask(task);
      set((state) => ({ tasks: [created, ...state.tasks] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Could not create reminder" });
      throw error;
    }
  },
  EditNotes:async(noteId:string,message)=>{
    try{
     const updatednote= await dataApi.EditNotes(noteId,message)
     set((state)=>({
      notes: state.notes.map((note) => note._id === noteId ? updatednote : note),
      loading: false,
     }))
    }catch(error){
      set({
        error: error instanceof Error ? error.message : "Could not create note",
        loading: false,
      });
      throw error;
      
    }
    
  }






}));
