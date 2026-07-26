import { useEffect, useState } from "react";
import ImageCropDialog from "./ImageCropDialog";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadLessonImage } from "@/lib/uploadLessonImage";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Rows3,
  Columns3,
  Trash2,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Crop,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

function getImageFiles(items?: DataTransferItemList | null): File[] {
  if (!items) return [];
  const out: File[] = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.kind === "file" && it.type.startsWith("image/")) {
      const f = it.getAsFile();
      if (f) out.push(f);
    }
  }
  return out;
}

async function uploadAndInsert(files: File[], editor: Editor | null) {
  if (!editor) return;
  for (const file of files) {
    const tId = toast.loading("Uploading image…");
    try {
      const url = await uploadLessonImage(file);
      // If an image node is currently selected, move caret just after it
      // so setImage inserts a new node instead of replacing the selected one.
      const { state } = editor;
      const selectedNode = (state.selection as any).node;
      if (selectedNode && (selectedNode.type.name === "image" || selectedNode.type.name === "imageResize")) {
        const to = state.selection.to;
        editor.chain().focus().insertContentAt(to, { type: selectedNode.type.name, attrs: { src: url } }).run();
      } else {
        editor.chain().focus().setImage({ src: url }).run();
      }
      toast.success("Image inserted", { id: tId });
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed", { id: tId });
    }
  }
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      ImageResize,
      Table.configure({ resizable: true, HTMLAttributes: { class: "lesson-table" } }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[260px] p-4 focus:outline-none prose-headings:font-display prose-a:text-primary",
      },
      handlePaste: (view, event) => {
        const files = getImageFiles(event.clipboardData?.items);
        if (files.length === 0) return false;
        event.preventDefault();
        uploadAndInsert(files, editorRef.current);
        return true;
      },
      handleDrop: (view, event) => {
        const files = getImageFiles(event.dataTransfer?.items);
        if (files.length === 0) return false;
        event.preventDefault();
        uploadAndInsert(files, editorRef.current);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // keep a ref so paste/drop handlers can access the current editor
  const editorRef = { current: editor as Editor | null };

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const [cropSrc, setCropSrc] = useState<string | null>(null);

  if (!editor) return null;

  const Btn = ({ on, active, children, label }: any) => (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="sm"
      className="h-8 w-8 p-0"
      onClick={on}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );

  return (
    <div className="rounded-xl border border-border bg-card/40">
      <div className="sticky top-0 z-20 flex flex-wrap gap-1 p-2 border-b border-border bg-card/95 backdrop-blur">
        <Btn label="Bold" on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold className="w-4 h-4" />
        </Btn>
        <Btn label="Italic" on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic className="w-4 h-4" />
        </Btn>
        <Btn label="H1" on={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
          <Heading1 className="w-4 h-4" />
        </Btn>
        <Btn label="H2" on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 className="w-4 h-4" />
        </Btn>
        <Btn label="H3" on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <Heading3 className="w-4 h-4" />
        </Btn>
        <Btn label="Bullet list" on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List className="w-4 h-4" />
        </Btn>
        <Btn label="Numbered list" on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered className="w-4 h-4" />
        </Btn>
        <Btn label="Quote" on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote className="w-4 h-4" />
        </Btn>
        <Btn label="Code" on={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
          <Code className="w-4 h-4" />
        </Btn>
        <Btn
          label="Link"
          on={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
          active={editor.isActive("link")}
        >
          <LinkIcon className="w-4 h-4" />
        </Btn>
        <Btn
          label="Image"
          on={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <ImageIcon className="w-4 h-4" />
        </Btn>
        <Btn
          label="Crop image (click image first)"
          on={() => {
            let src = editor.getAttributes("image").src as string | undefined;
            if (!src) src = editor.getAttributes("imageResize").src as string | undefined;
            if (!src) {
              // Fallback: find selected image in DOM
              const el = editor.view.dom.querySelector<HTMLImageElement>(
                "img.ProseMirror-selectednode, .ProseMirror-selectednode img"
              );
              src = el?.src;
            }
            if (src) setCropSrc(src);
            else toast.error("Click an image first, then press crop");
          }}
        >
          <Crop className="w-4 h-4" />
        </Btn>
        <Btn
          label="Insert table"
          on={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon className="w-4 h-4" />
        </Btn>
        {editor.isActive("table") && (
          <>
            <Btn label="Add row" on={() => editor.chain().focus().addRowAfter().run()}>
              <Rows3 className="w-4 h-4" />
            </Btn>
            <Btn label="Add column" on={() => editor.chain().focus().addColumnAfter().run()}>
              <Columns3 className="w-4 h-4" />
            </Btn>
            <Btn label="Delete table" on={() => editor.chain().focus().deleteTable().run()}>
              <Trash2 className="w-4 h-4" />
            </Btn>
          </>
        )}
        <Btn label="Align left" on={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
          <AlignLeft className="w-4 h-4" />
        </Btn>
        <Btn label="Align center" on={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
          <AlignCenter className="w-4 h-4" />
        </Btn>
        <Btn label="Align right" on={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
          <AlignRight className="w-4 h-4" />
        </Btn>
        <Btn label="Justify" on={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })}>
          <AlignJustify className="w-4 h-4" />
        </Btn>
        <div className="flex-1" />
        <Btn label="Undo" on={() => editor.chain().focus().undo().run()}>
          <Undo className="w-4 h-4" />
        </Btn>
        <Btn label="Redo" on={() => editor.chain().focus().redo().run()}>
          <Redo className="w-4 h-4" />
        </Btn>
      </div>
      <EditorContent editor={editor} />
      <ImageCropDialog
        src={cropSrc}
        onClose={() => setCropSrc(null)}
        onCropped={(url) => {
          const oldSrc = cropSrc;
          if (!oldSrc) return;
          const { state } = editor;
          const matches: { pos: number; typeName: string }[] = [];
          state.doc.descendants((node, p) => {
            if (
              (node.type.name === "image" ||
                node.type.name === "imageResize") &&
              node.attrs?.src === oldSrc
            ) {
              matches.push({ pos: p, typeName: node.type.name });
            }
            return true;
          });
          if (matches.length === 0) {
            // Fallback: string-replace in HTML
            const html = editor.getHTML();
            if (html.includes(oldSrc)) {
              editor
                .chain()
                .focus()
                .setContent(html.split(oldSrc).join(url))
                .run();
              toast.success("Image replaced");
            } else {
              toast.error("Could not locate image to replace");
            }
            return;
          }
          editor
            .chain()
            .focus()
            .command(({ tr }) => {
              for (const m of matches) {
                const node = tr.doc.nodeAt(m.pos);
                if (!node) continue;
                tr.setNodeMarkup(m.pos, undefined, {
                  ...node.attrs,
                  src: url,
                  width: null,
                  height: null,
                });
              }
              return true;
            })
            .run();
        }}
      />
    </div>
  );
}
