import { create } from "zustand";
import { api, dataApi, type ApiDirectory, type ApiNote } from "../lib/api";

type WorkspaceState = {
  directories: ApiDirectory[];
  notes: ApiNote[];
  loading: boolean;
  error: string | null;
  loadDirectories: (userId: string) => Promise<void>;
  loadNotes: (directoryId?: string) => Promise<void>;
  addDirectory: (name: string, userId: string) => Promise<void>;
  addNote: (
    directoryId: string,
    note: Pick<ApiNote, "title" | "desc" | "uid">,
    token: string,
  ) => Promise<void>;
  removeNote: (noteId: string, token: string) => Promise<void>;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  directories: [],
  notes: [],
  loading: false,
  error: null,
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
  loadNotes: async (directoryId) => {
    set({ loading: true, error: null });
    try {
      set({
        notes: 
           await dataApi.getNotes(directoryId)
          ,
        loading: false,
      });
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
  addNote: async (directoryId, note, token) => {
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
  removeNote: async (noteId, token) => {
    await api.deleteNote(noteId, token);
    set((state) => ({
      notes: state.notes.filter((note) => note._id !== noteId),
    }));
  },
}));
