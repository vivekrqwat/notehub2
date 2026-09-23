import { ArrowLeft, Bold, CalendarDays, Check, Code2, Copy, FileText, Heading2, Italic, List, ListOrdered, Minus, Pencil, Plus, Redo2, RemoveFormatting, Search, Strikethrough, Trash2, Undo2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { UseWorkspace } from "../Hooks/UseWorkspace";
import { UseAuth } from "../Context/Useauth";
import { useWorkspaceStore } from "../store/WorkSpaceStore";
import type { ApiNote } from "../lib/api";
import { Dialog } from "../Components/ui/dialog";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

function escapeHtml(value: string) {
	return value.replace(/[&<>'"]/g, (character) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"'": "&#39;",
		'"': "&quot;",
	}[character] ?? character));
}

function sanitizeRichText(value: string) {
	if (!value.includes("<")) return escapeHtml(value).replace(/\n/g, "<br />");
	const document = new DOMParser().parseFromString(value, "text/html");
	const allowed = new Set(["B", "STRONG", "I", "EM", "U", "S", "BR", "P", "DIV", "H1", "H2", "H3", "UL", "OL", "LI", "BLOCKQUOTE", "PRE", "CODE", "SPAN"]);
	const allowedStyles = new Set(["font-family", "font-size", "font-weight", "font-style", "text-decoration", "color", "background-color", "white-space", "text-align"]);
	document.body.querySelectorAll("*").forEach((element) => {
		if (!allowed.has(element.tagName)) {
			element.replaceWith(...Array.from(element.childNodes));
			return;
		}
		Array.from(element.attributes).forEach((attribute) => {
			if (attribute.name !== "style") element.removeAttribute(attribute.name);
		});
		if (element.hasAttribute("style")) {
			const safeStyles = element.getAttribute("style")?.split(";").filter((declaration) => {
				const property = declaration.split(":")[0]?.trim().toLowerCase();
				return allowedStyles.has(property);
			}).join(";");
			element.setAttribute("style", safeStyles ?? "");
		}
	});
	return document.body.innerHTML;
}

function richTextToPlainText(value: string) {
	if (!value.includes("<")) return value;
	const document = new DOMParser().parseFromString(value, "text/html");
	return document.body.textContent ?? "";
}

function RichTextEditor({ value, onChange, ariaLabel }: { value: string; onChange: (value: string) => void; ariaLabel: string }) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3] },
			}),
			Placeholder.configure({ placeholder: "Write something worth remembering..." }),
		],
		content: sanitizeRichText(value),
		onUpdate: ({ editor: nextEditor }) => onChange(nextEditor.getHTML()),
	});

	useEffect(() => {
		if (editor && sanitizeRichText(value) !== editor.getHTML()) {
			editor.commands.setContent(sanitizeRichText(value), { emitUpdate: false });
		}
	}, [editor, value]);

	if (!editor) return null;

	const toolbarButton = (label: string, icon: React.ReactNode, action: () => void, active = false) => (
		<button type="button" className={active ? "is-active" : ""} onClick={action} aria-label={label} title={label}>
			{icon}
		</button>
	);

	return (
		<div className="rich-text-editor" role="textbox" aria-label={ariaLabel}>
			<div className="rich-text-toolbar" aria-label="Text formatting">
				{toolbarButton("Heading", <Heading2 size={16} />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
				{toolbarButton("Bold", <Bold size={16} />, () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
				{toolbarButton("Italic", <Italic size={16} />, () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
				{toolbarButton("Strikethrough", <Strikethrough size={16} />, () => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"))}
				<span className="rich-text-toolbar-divider" />
				{toolbarButton("Bullet list", <List size={16} />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
				{toolbarButton("Numbered list", <ListOrdered size={16} />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
				{toolbarButton("Blockquote", <Minus size={16} />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
				{toolbarButton("Code block", <Code2 size={16} />, () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"))}
				<span className="rich-text-toolbar-divider" />
				{toolbarButton("Undo", <Undo2 size={16} />, () => editor.chain().focus().undo().run())}
				{toolbarButton("Redo", <Redo2 size={16} />, () => editor.chain().focus().redo().run())}
				{toolbarButton("Clear formatting", <RemoveFormatting size={16} />, () => editor.chain().focus().clearNodes().unsetAllMarks().run())}
			</div>
			<EditorContent editor={editor} className="rich-text-content" />
		</div>
	);
}

function NoteCard({
	note,
	index,
	editing,
	title,
	description,
	onTitleChange,
	onDescriptionChange,
	onEdit,
	onDelete,
	onCopy,
	copied,
	onSave,
	onCancel,
onAutoSave,
}: {
	note: ApiNote;
	index: number;
	editing: boolean;
	title: string;
	description: string;
	onTitleChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onEdit: () => void;
	onDelete: () => void;
	onCopy: () => void;
	copied: boolean;
	onSave: (event: React.FormEvent<HTMLFormElement>) => void;
	onCancel: () => void;
	onAutoSave: () => void;
}) {



	useEffect(() => {
		if (!editing) return;

		const intervalId = window.setInterval(onAutoSave, 5 * 60 * 1000);
		return () => window.clearInterval(intervalId);
	}, [editing, onAutoSave]);

	return (
		<>
			<div className="note-card-topline">
				<div className="note-card-icon"><FileText size={21} /></div>
				<div className="note-card-actions" aria-label="Note actions">
					<button type="button" onClick={onCopy} aria-label={copied ? "Copied note" : "Copy note"} title={copied ? "Copied" : "Copy note"}>
						{copied ? <Check size={16} /> : <Copy size={16} />}
					</button>
					<button type="button" onClick={onEdit} aria-label="Edit note" title="Edit note"><Pencil size={16} /></button>
					<button type="button" onClick={onDelete} aria-label="Delete note" title="Delete note"><Trash2 size={16} /></button>
				</div>
			</div>
			{editing ? (
				<form className="note-edit-form" onSubmit={onSave}>
					<p className="note-card-number">Editing note {String(index + 1).padStart(2, "0")}</p>
					<input value={title} onChange={(event) => onTitleChange(event.target.value)} aria-label="Note title" required />
					<RichTextEditor value={description} onChange={onDescriptionChange} ariaLabel="Note description" />
					<div className="note-edit-actions">
						<button type="button" onClick={onCancel}>Cancel</button>
						<button type="submit">Save changes</button>
					</div>
				</form>
			) : (
				<div className="note-card-body">
					<p className="note-card-number">Note {String(index + 1).padStart(2, "0")}</p>
					<h2>{note.title}</h2>
					<div className="note-description" dangerouslySetInnerHTML={{ __html: sanitizeRichText(note.desc || "No description added yet.") }} />
				</div>
			)}
			<footer className="note-card-footer">
				<CalendarDays size={15} />
				<span>In this directory</span>
			</footer>
		</>
	);
}

export function NotesPage() {
	const { directoryId } = useParams<{ directoryId: string }>();
	const { notes, directories, loading, error } = UseWorkspace();
	const notesPagination = useWorkspaceStore((state) => state.notesPagination);
    const loadNotes=useWorkspaceStore(((state) => state.loadNotes))
	const addNote = useWorkspaceStore((state) => state.addNote);
	const { user } = UseAuth();
	const [search, setSearch] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const [page, setPage] = useState(1);
	const [isEndOfNotes, setIsEndOfNotes] = useState(false);
	const [dragOffset, setDragOffset] = useState(0);
	const [pointerStart, setPointerStart] = useState<{ x: number; y: number } | null>(null);
	const [isSwiping, setIsSwiping] = useState(false);
	const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
	const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [deleteNote, setDeleteNote] = useState<ApiNote | null>(null);
	const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
	const didDrag = useRef(false);
	const pendingIndex = useRef<number | null>(null);
	useEffect(() => {
		if (directoryId) {
			void (async () => {
				await loadNotes(directoryId, String(page));
				if (pendingIndex.current !== null) {
					const loadedCount = useWorkspaceStore.getState().notes.length;
					setActiveIndex(Math.min(pendingIndex.current, Math.max(loadedCount - 1, 0)));
					pendingIndex.current = null;
				}
			})();
		}
	}, [directoryId, loadNotes, page]);

	const directory = directories.find((item) => item._id === directoryId);
	const visibleNotes = useMemo(() => {
		const query = search.trim().toLowerCase();

		return notes.filter((note) => {
			if (!query) return true;
			return `${note.title} ${note.desc}`.toLowerCase().includes(query);
		});
	}, [notes, search]);

	const deckSize = visibleNotes.length;
	const safeActiveIndex = deckSize === 0 ? 0 : activeIndex % deckSize;
	const activeNote = visibleNotes[safeActiveIndex];
	const nextNoteIndex = deckSize === 0 ? 0 : (safeActiveIndex + 1) % deckSize;
	const nextNote = visibleNotes[nextNoteIndex];
	const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 761px)").matches;

	const finishSwipe = (direction: number) => {
		if (direction < 0 && safeActiveIndex === deckSize - 1) {
			const targetPage = page < (notesPagination?.totalPages ?? 1) ? page + 1 : 1;
			if (targetPage === page) {
				setActiveIndex(0);
				return;
			}
			pendingIndex.current = 0;
			setPage(targetPage);
			setDragOffset(0);
			setIsEndOfNotes(false);
			return;
		}
		if (direction > 0 && safeActiveIndex === 0) {
			const lastPage = notesPagination?.totalPages ?? 1;
			if (lastPage === page) {
				setActiveIndex(Math.max(deckSize - 1, 0));
				return;
			}
			if (page > 1) {
				pendingIndex.current = 9;
				setPage(page - 1);
			} else {
				pendingIndex.current = 9;
				setPage(lastPage);
			}
			setDragOffset(0);
			setIsEndOfNotes(false);
			return;
		}
		setDragOffset(isDesktop ? -direction * window.innerHeight : direction * window.innerWidth);
		window.setTimeout(() => {
			setActiveIndex((index) => (index + (direction < 0 ? 1 : -1) + deckSize) % deckSize);
			setDragOffset(0);
			setIsSwiping(false);
		}, 280);
	};

	const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
		if (editingNoteId || (event.target as HTMLElement).closest("button, input, textarea")) return;
		setPointerStart({ x: event.clientX, y: event.clientY });
		didDrag.current = false;
		setIsSwiping(true);
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
		if (pointerStart === null) return;
		const isDesktop = window.matchMedia("(min-width: 761px)").matches;
		const distance = isDesktop ? pointerStart.y - event.clientY : event.clientX - pointerStart.x;
		if (Math.abs(distance) > 8) didDrag.current = true;
		setDragOffset(distance);
	};

	const handlePointerUp = () => {
		if (pointerStart === null) return;
		if (Math.abs(dragOffset) > 90) {
			finishSwipe(dragOffset > 0 ? 1 : -1);
		} else {
			setDragOffset(0);
			setIsSwiping(false);
		}
		setPointerStart(null);
	};

	const handleReaderClick = (event: React.MouseEvent<HTMLElement>) => {
		if (editingNoteId || (event.target as HTMLElement).closest("button, input, textarea")) return;
		if (didDrag.current) {
			didDrag.current = false;
			return;
		}
		const bounds = event.currentTarget.getBoundingClientRect();
		const direction = event.clientX - bounds.left < bounds.width / 2 ? 1 : -1;
		finishSwipe(direction);
	};

	const handleEndRestart = () => {
		setIsEndOfNotes(false);
		setActiveIndex(0);
	};

	const goToPage = (nextPage: number) => {
		if (nextPage === page) return;
		setPage(nextPage);
		setActiveIndex(0);
		setIsEndOfNotes(false);
		setDragOffset(0);
		setEditingNoteId(null);
	};

	const selectNote = (index: number) => {
		if (index === safeActiveIndex) {
			setIsNavigatorOpen(false);
			return;
		}
		const direction = index > safeActiveIndex ? -1 : 1;
		setDragOffset(isDesktop ? -direction * window.innerHeight : direction * window.innerWidth);
		setIsSwiping(true);
		window.setTimeout(() => {
			setActiveIndex(index);
			setDragOffset(0);
			setIsSwiping(false);
			setIsNavigatorOpen(false);
		}, 280);
	};

	const submitNote = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!directoryId || !user?.id || !title.trim()) return;

		await addNote(directoryId, {
			title: title.trim(),
			desc: description.trim(),
			uid: user.id,
		});
		setTitle("");
		setDescription("");
		setIsAdding(false);
	};

	const startEditing = (note: ApiNote) => {
		setEditingNoteId(note._id);
		setEditTitle(note.title);
		setEditDescription(note.desc);
	};

	const autoSaveEdit = useCallback(async () => {
		if (!editingNoteId || !editTitle.trim() || !user?.id) return;

		await useWorkspaceStore.getState().EditNotes(editingNoteId, {
			_id: editingNoteId,
			title: editTitle.trim(),
			desc: editDescription,
			dirid: directoryId ?? "",
			uid: user.id,
		});
	}, [directoryId, editDescription, editTitle, editingNoteId, user?.id]);

	const saveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await autoSaveEdit();
		setEditingNoteId(null);
	};

	const confirmDelete = async () => {
		if (!deleteNote) return;
		await useWorkspaceStore.getState().removeNote(deleteNote._id, "");
		setDeleteNote(null);
		setActiveIndex((index) => Math.max(0, Math.min(index, visibleNotes.length - 2)));
	};

	const copyNote = async (note: ApiNote) => {
		const plainText = `${note.title}\n\n${richTextToPlainText(note.desc)}`;
		const htmlText = `<h1>${escapeHtml(note.title)}</h1>${sanitizeRichText(note.desc)}`;
		if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
			await navigator.clipboard.write([
				new ClipboardItem({
					"text/plain": new Blob([plainText], { type: "text/plain" }),
					"text/html": new Blob([htmlText], { type: "text/html" }),
				}),
			]);
		} else {
			await navigator.clipboard.writeText(plainText);
		}
		setCopiedNoteId(note._id);
		window.setTimeout(() => setCopiedNoteId(null), 1400);
	};

	return (
		<main className="notes-page">
			<header className="notes-page-header">
				<Link className="back-link" to="/home" aria-label="Back to home">
					<ArrowLeft size={17} />
					Workspace
				</Link>
				<p className="eyebrow">
					{directory?.name ?? "Directory"} <span className="eyebrow-dot" />
				</p>
				<h1>Your notes</h1>
				<p className="notes-page-intro">
					Keep the ideas in this space close, clear, and easy to revisit.
				</p>
			</header>

			<section className="notes-toolbar" aria-label="Notes controls">
				<label className="notes-search">
					<Search size={18} aria-hidden="true" />
					<span className="sr-only">Search notes</span>
					<input
						type="search"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search notes"
					/>
				</label>
				<div className="notes-toolbar-actions">
					<span className="notes-result-count">
						{visibleNotes.length} {visibleNotes.length === 1 ? "note" : "notes"}
					</span>
					<Button className="add-note-button" onClick={() => setIsAdding(true)}>
						<Plus size={16} /> Add note
					</Button>
				</div>
			</section>

			{loading ? <p className="notes-status">Loading notes...</p> : null}
			{error ? <p className="notes-status notes-status-error">{error}</p> : null}

			{!loading && !error ? (
				<section className="notes-reader" aria-label="Notes reader">
					<button
						className="notes-navigator-toggle"
						onClick={() => setIsNavigatorOpen((open) => !open)}
						aria-expanded={isNavigatorOpen}
					>
						{isNavigatorOpen ? <X size={17} /> : <List size={17} />}
						{isNavigatorOpen ? "Close notes" : "Notes"}
					</button>
					<div className={`reader-layout ${isNavigatorOpen ? "navigator-is-open" : ""}`}>
						<aside className="notes-navigator" aria-label="Notes in this directory">
							<div className="notes-navigator-heading">
								<span>Notes</span>
								<strong>{safeActiveIndex + 1} / {deckSize}</strong>
							</div>
							<div className="notes-navigator-list">
								{visibleNotes.map((note, index) => (
									<button
										className={`note-preview ${index === safeActiveIndex ? "is-active" : ""}`}
										key={note._id}
										onClick={() => selectNote(index)}
									>
										<span className="note-preview-number">{String(index + 1).padStart(2, "0")}</span>
										<span className="note-preview-copy">
											<strong>{note.title}</strong>
											<small>{note.desc || "No description"}</small>
										</span>
									</button>
								))}
							</div>
						</aside>
						<div className="reader-stage">
						{isEndOfNotes ? (
							<article className="note-card reader-card end-notes-card">
								<div className="note-card-icon"><Check size={21} /></div>
								<div className="note-card-body">
									<p className="note-card-number">End of notes</p>
									<h2>You reached the end.</h2>
									<p>There are no more notes in this directory.</p>
								</div>
								<button className="add-note-button" onClick={handleEndRestart}>Read again</button>
							</article>
						) : null}
						{nextNote && nextNoteIndex !== safeActiveIndex ? (
							<div className={`note-card reader-card reader-card-next note-card-${nextNoteIndex % 4}`} aria-hidden="true">
								<NoteCard note={nextNote} index={nextNoteIndex} editing={false} title="" description="" onTitleChange={() => undefined} onDescriptionChange={() => undefined} onEdit={() => undefined} onDelete={() => undefined} onCopy={() => undefined} copied={false} onSave={() => undefined} onCancel={() => undefined} onAutoSave={() => undefined} />
							</div>
						) : null}
						<article
							className={`note-card reader-card reader-card-active note-card-${safeActiveIndex % 4} ${isSwiping ? "is-swiping" : ""}`}
							style={{
								transform: isDesktop
									? `translateY(${-dragOffset}px)`
									: `translateX(${dragOffset}px) rotate(${dragOffset / 28}deg)`,
							}}
							onPointerDown={handlePointerDown}
							onPointerMove={handlePointerMove}
							onPointerUp={handlePointerUp}
							onPointerCancel={handlePointerUp}
							onClick={handleReaderClick}
						>
							{activeNote ? (
								<NoteCard
									note={activeNote}
									index={safeActiveIndex}
									editing={editingNoteId === activeNote._id}
									title={editTitle}
									description={editDescription}
									onTitleChange={setEditTitle}
									onDescriptionChange={setEditDescription}
									onEdit={() => startEditing(activeNote)}
									onDelete={() => setDeleteNote(activeNote)}
									onCopy={() => void copyNote(activeNote)}
									copied={copiedNoteId === activeNote._id}
									onSave={saveEdit}
									onCancel={() => setEditingNoteId(null)}
									onAutoSave={() => void autoSaveEdit()}
								/>
							) : null}
						</article>
						</div>
					</div>
					<div className="reader-controls">
						<span>Swipe to turn the page</span>
						<strong>{safeActiveIndex + 1} / {deckSize}</strong>
					</div>
					<nav className="notes-pagination" aria-label="Notes pages">
						<span className="pagination-limit">10 per page</span>
						<div className="pagination-pages">
							{Array.from({ length: notesPagination?.totalPages ?? 1 }, (_, index) => index + 1).map((pageNumber) => (
								<button
									key={pageNumber}
									className={pageNumber === page ? "is-current" : ""}
									onClick={() => goToPage(pageNumber)}
									aria-current={pageNumber === page ? "page" : undefined}
								>
									{pageNumber}
								</button>
							))}
						</div>
					</nav>
				</section>
			) : null}

			<Dialog open={isAdding} onClose={() => setIsAdding(false)}>
				<div className="modal-icon"><Plus size={21} /></div>
				<p className="eyebrow">Make some space</p>
				<h2>New note</h2>
				<p className="muted">Capture an idea for this directory.</p>
				<form className="note-dialog-form" onSubmit={submitNote}>
					<Input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" required />
					<RichTextEditor value={description} onChange={setDescription} ariaLabel="Note description" />
					<div className="modal-actions">
						<Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
						<Button type="submit" disabled={!user?.id}>Save note</Button>
					</div>
				</form>
			</Dialog>

			<Dialog open={deleteNote !== null} onClose={() => setDeleteNote(null)}>
				<div className="modal-icon"><Trash2 size={21} /></div>
				<p className="eyebrow">Delete note</p>
				<h2>Are you sure?</h2>
				<p className="muted">This will permanently delete {deleteNote?.title ? `“${deleteNote.title}”` : "this note"}.</p>
				<div className="modal-actions">
					<Button type="button" variant="ghost" onClick={() => setDeleteNote(null)}>Cancel</Button>
					<Button type="button" variant="destructive" onClick={() => void confirmDelete()}>Delete note</Button>
				</div>
			</Dialog>

			{!loading && !error && visibleNotes.length === 0 && search ? (
				<section className="notes-empty">
					<div className="note-card-icon">
						<FileText size={21} />
					</div>
					<h2>{search ? "No notes match your search" : "This space is still empty"}</h2>
					<p>
						{search
							? "Try a different title or description."
							: "Create a note from the workspace to start filling it."}
					</p>
				</section>
			) : null}
		</main>
	);
}
