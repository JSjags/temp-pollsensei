// // ReportDraftPage.tsx (Editor-enabled version w/ categories hook)
// // -----------------------------------------------------------------------------
// // Enhancements in this revision:
// //   • Integrates your `useReportCategory()` hook to populate the Category select.
// //   • Displays loading state (disabled select + "Loading..." placeholder) while categories load.
// //   • Gracefully falls back to passed-in categories prop or local defaults if the hook errors/returns empty.
// //   • Keeps everything else from the TipTap editor version (title input, rich editor, autosave, etc.).
// //
// // Update the import path for `useReportCategory` below to match your actual project structure.
// // -----------------------------------------------------------------------------

// "use client";

// import * as React from "react";
// import NextLink from "next/link";
// import Image from "next/image";

// // ------------------------------------------------------------------
// // UI Primitives (update the import paths to match your project)
// // ------------------------------------------------------------------
// import { Button } from "@/components/ui/button";

// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// // ------------------------------------------------------------------
// // Data hook — update path as needed
// // ------------------------------------------------------------------
// // NOTE: I'm guessing the path; adjust to wherever the hook actually lives.

// // If your actual path is different (e.g., "@/hooks/report/useReportCategory"), change the import.

// // Lucide icons (swap for your asset icons as desired)
// import {
//   Upload as UploadIcon,
//   Bell as BellIcon,
//   Copy as CopyIcon,
//   MoreHorizontal as MoreHorizontalIcon,
//   Image as ImageIcon,
//   Table as TableIcon,
//   BarChart3 as ChartIcon,
//   Sparkles as AiIcon,
//   Bold as BoldIcon,
//   Italic as ItalicIcon,
//   Underline as UnderlineIcon,
//   Strikethrough as StrikeIcon,
//   Heading1 as H1Icon,
//   Heading2 as H2Icon,
//   List as BulletIcon,
//   ListOrdered as OrderedIcon,
//   Quote as QuoteIcon,
//   Code2 as CodeIcon,
//   Undo2 as UndoIcon,
//   Redo2 as RedoIcon,
// } from "lucide-react";

// // ------------------------------------------------------------------
// // TipTap imports
// // ------------------------------------------------------------------
// import { useEditor, EditorContent, type Editor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";
// import ImageExtension from "@tiptap/extension-image";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import { createLowlight, all } from "lowlight";
// import { useReportCategory } from "@/components/reports/queries/useCategories";
// import { Input } from "@/components/ui/shadcn-input";
// import { Textarea } from "@/components/ui/shadcn-textarea";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import StyleEditor from "@/subpages/survey/StyleEditor";
// import { usePublishReport, useReportMediaUpload } from "@/components/reports/queries/usePostOnboard";

// // ------------------------------------------------------------------
// // Types
// // ------------------------------------------------------------------
// export interface ReportDraftData {
//   id: string;
//   title: string;
//   description?: string | null;
//   category?: string | null;
//   thumbnailUrl?: string | null;
//   /** Raw body content. Accepts HTML string OR TipTap JSON string; see props */
//   body?: string | null;
// }

// interface ReportDraftPageProps {
//   report: ReportDraftData; // fully loaded report data
//   /** If body is HTML pass `contentFormat="html"`; if TipTap JSON pass `json"` */
//   contentFormat?: "html" | "json";
//   /** Optional categories list from parent (fallback if hook fails) */
//   categories?: Array<{ value: string; label: string }>;
//   /** Called when title/description/category/thumbnail changes */
//   onMetaChange?: (data: ReportFormState) => void;
//   /** Called when editor content changes (debounced below) */
//   onContentChange?: (body: string) => void; // same format as contentFormat
//   /** Called when Publish button clicked */
//   onPublish?: (data: PublishPayload) => Promise<void> | void;
//   /** Called when Compare Report clicked */
//   onCompareReport?: (reportId: string) => void;
//   /** Quick insert: Ask AI hook */
//   onAskAIRequest?: (
//     currentContentHtml: string
//   ) => Promise<string> | string | void;
//   /** Autosave interval (ms). If provided, debounced content changes will call onContentChange */
//   autosaveDelayMs?: number;
//   /** If true, show a small "Saving... / Saved" indicator when autosave in progress */
//   showSavingIndicator?: boolean;
//   className?: string;
// }

// interface ReportFormState {
//   title: string;
//   description: string;
//   category: string;
//   thumbnailFile?: File | null;
//   thumbnailUrl?: string | null; // remote URL after upload
// }

// export interface PublishPayload extends ReportFormState {
//   body: string; // serialized in the same format as `contentFormat`
//   reportId: string;
// }

// // ------------------------------------------------------------------
// // Breadcrumbs
// // ------------------------------------------------------------------
// interface Crumb {
//   label: string;
//   href?: string; // Optional navigation link
//   onClick?: () => void; // Optional click handler
// }

// function Breadcrumbs({ items }: { items: Crumb[] }) {
//   return (
//     <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
//       <ol className="flex items-center gap-1 flex-wrap">
//         {items.map((c, i) => {
//           const isLast = i === items.length - 1;

//           return (
//             <li key={i} className="flex items-center gap-1">
//               {c.href && !isLast ? (
//                 <NextLink
//                   href={c.href}
//                   className={cn("transition-colors hover:text-foreground")}
//                 >
//                   {c.label}
//                 </NextLink>
//               ) : c.onClick && !isLast ? (
//                 <button
//                   onClick={c.onClick}
//                   type="button"
//                   className="transition-colors hover:text-foreground"
//                 >
//                   {c.label}
//                 </button>
//               ) : (
//                 <span
//                   className={cn(
//                     "transition-colors",
//                     isLast && "text-foreground font-medium"
//                   )}
//                 >
//                   {c.label}
//                 </span>
//               )}
//               {!isLast && <span className="mx-1">/</span>}
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// }

// // ------------------------------------------------------------------
// // Thumbnail Dropzone (lightweight; swap w/ your uploader if needed)
// // ------------------------------------------------------------------
// interface ThumbnailDropzoneProps {
//   valueUrl?: string | null;
//   onChangeFile: (file: File | null) => void;
//   className?: string;
// }

// function ThumbnailDropzone({
//   valueUrl,
//   onChangeFile,
//   className,
// }: ThumbnailDropzoneProps) {
//   const inputRef = React.useRef<HTMLInputElement | null>(null);
//   const [isDragging, setDragging] = React.useState(false);
//   const [preview, setPreview] = React.useState<string | null>(valueUrl ?? null);

//   React.useEffect(() => {
//     setPreview(valueUrl ?? null);
//   }, [valueUrl]);

//   const handleFiles = React.useCallback(
//     (files: FileList | null) => {
//       if (!files || files.length === 0) {
//         onChangeFile(null);
//         setPreview(null);
//         return;
//       }
//       const file = files[0];
//       onChangeFile(file);
//       const url = URL.createObjectURL(file);
//       setPreview(url);
//     },
//     [onChangeFile]
//   );

//   const openFilePicker = () => inputRef.current?.click();
//   const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(true);
//   };
//   const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(false);
//   };
//   const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(false);
//     handleFiles(e.dataTransfer.files);
//   };

//   return (
//     <div className={cn("w-full", className)}>
//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={(e) => handleFiles(e.target.files)}
//       />
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={openFilePicker}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") openFilePicker();
//         }}
//         onDragOver={onDragOver}
//         onDragLeave={onDragLeave}
//         onDrop={onDrop}
//         className={cn(
//           "flex flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 p-6 text-center cursor-pointer transition-colors",
//           isDragging && "bg-muted"
//         )}
//       >
//         {preview ? (
//           <div className="relative aspect-video w-full max-w-[240px]">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               src={preview}
//               alt="Thumbnail preview"
//               className="h-full w-full object-cover rounded-md"
//             />
//           </div>
//         ) : (
//           <>
//             <UploadIcon className="h-6 w-6 text-muted-foreground" />
//             <p className="mt-2 text-sm font-medium">
//               Click to Upload your image
//             </p>
//             <p className="text-xs text-muted-foreground">or drag and drop</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// interface ReportThumbnailUploaderProps {
//   reportId?: string; // upload only if present
//   thumbnailUrl?: string | null;
//   onChange: (partial: Partial<ReportFormState>) => void;
//   className?: string;
//   /** Extra form fields for backend (mark as thumbnail, etc.) */
//   extraFields?: Record<string, any>;
// }

// function ReportThumbnailUploader({
//   reportId,
//   thumbnailUrl,
//   onChange,
//   className,
//   extraFields,
// }: ReportThumbnailUploaderProps) {
//   const {
//     mutate: uploadMedia,
//     isPending,
//     error,
//     data,
//     progress,
//   } = useReportMediaUpload();

//   const uploading = isPending;

//   /**
//    * This is the ONLY function we pass to ThumbnailDropzone.
//    * It preserves its original API: (file: File | null) => void
//    * We call onChange({thumbnailFile: file}) to preserve old behavior,
//    * then (if we have a reportId && file) fire the upload.
//    */
//   const handleFile = React.useCallback(
//     (file: File | null) => {
//       // Preserve legacy behavior: store the File locally.
//       onChange({ thumbnailFile: file });

//       if (!file || !reportId) return;

//       uploadMedia(
//         {
//           reportId,
//           files: [file],
//           extraFields: { is_thumbnail: "true", ...extraFields },
//         },
//         {
//           onSuccess: (res) => {
//             const uploaded = res.media?.[0];
//             if (uploaded?.url) {
//               // Update form with remote URL.
//               onChange({ thumbnailUrl: uploaded.url });
//             }
//           },
//         }
//       );
//     },
//     [onChange, reportId, uploadMedia, extraFields]
//   );

//   return (
//     <div className={className}>
//       <ThumbnailDropzone
//         valueUrl={thumbnailUrl}
//         onChangeFile={handleFile}
//         className="w-full"
//       />

//       {/* Upload state UI (optional, shown only if reportId exists) */}
//       {reportId && (
//         <>
//           {uploading && (
//             <div className="mt-2 text-[11px] text-muted-foreground">
//               Uploading… {progress}%
//               <div className="mt-1 h-1 w-full rounded bg-muted">
//                 <div
//                   className="h-1 rounded bg-primary transition-all"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>
//           )}
//           {error && (
//             <div className="mt-2 text-[11px] text-destructive">
//               Failed to upload: {error.message}
//             </div>
//           )}
//           {data?.success && !uploading && (
//             <div className="mt-2 text-[11px] text-green-600">
//               Thumbnail uploaded.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// // ------------------------------------------------------------------
// // Formatting Toolbar Button
// // ------------------------------------------------------------------
// interface ToolbarButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   active?: boolean;
//   children: React.ReactNode;
//   label: string;
// }

// function ToolbarButton({
//   active,
//   children,
//   label,
//   className,
//   ...rest
// }: ToolbarButtonProps) {
//   return (
//     <Button
//       type="button"
//       variant={active ? "default" : "ghost"}
//       //   size="iconSm"
//       aria-label={label}
//       title={label}
//       className={cn("h-7 w-7 p-0", className)}
//       {...rest}
//     >
//       {children}
//     </Button>
//   );
// }

// // ------------------------------------------------------------------
// // Formatting Toolbar (inline above editor)
// // ------------------------------------------------------------------
// interface FormattingToolbarProps {
//   editor: Editor | null;
// }

// function FormattingToolbar({ editor }: FormattingToolbarProps) {
//   if (!editor) return null;
//   return (
//     <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm sticky top-0 z-10">
//       <ToolbarButton
//         label="Bold"
//         active={editor.isActive("bold")}
//         onClick={() => editor.chain().focus().toggleBold().run()}
//       >
//         <BoldIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Italic"
//         active={editor.isActive("italic")}
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//       >
//         <ItalicIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Underline"
//         active={editor.isActive("underline")}
//         onClick={() => editor.chain().focus().toggleUnderline().run()}
//       >
//         <UnderlineIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Strike"
//         active={editor.isActive("strike")}
//         onClick={() => editor.chain().focus().toggleStrike().run()}
//       >
//         <StrikeIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <span className="mx-1 h-4 w-px bg-border" />
//       <ToolbarButton
//         label="Heading 1"
//         active={editor.isActive("heading", { level: 1 })}
//         onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//       >
//         <H1Icon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Heading 2"
//         active={editor.isActive("heading", { level: 2 })}
//         onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//       >
//         <H2Icon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <span className="mx-1 h-4 w-px bg-border" />
//       <ToolbarButton
//         label="Bullet List"
//         active={editor.isActive("bulletList")}
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//       >
//         <BulletIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Ordered List"
//         active={editor.isActive("orderedList")}
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//       >
//         <OrderedIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Block Quote"
//         active={editor.isActive("blockquote")}
//         onClick={() => editor.chain().focus().toggleBlockquote().run()}
//       >
//         <QuoteIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Code Block"
//         active={editor.isActive("codeBlock")}
//         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//       >
//         <CodeIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <span className="mx-1 h-4 w-px bg-border" />
//       <ToolbarButton
//         label="Undo"
//         onClick={() => editor.chain().focus().undo().run()}
//       >
//         <UndoIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Redo"
//         onClick={() => editor.chain().focus().redo().run()}
//       >
//         <RedoIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//     </div>
//   );
// }

// // ------------------------------------------------------------------
// // Rich Editor Wrapper
// // ------------------------------------------------------------------
// interface ReportRichEditorProps {
//   initialContent?: string; // html or json depending on format
//   format?: "html" | "json";
//   onChange?: (content: string) => void; // returns same format
//   askAI?: (() => void) | undefined;
//   insertImage?: (() => void) | undefined;
//   insertTable?: (() => void) | undefined;
//   insertChart?: (() => void) | undefined;
//   insertMore?: (() => void) | undefined;
// }

// function ReportRichEditor({
//   initialContent,
//   format = "html",
//   onChange,
//   askAI,
//   insertImage,
//   insertTable,
//   insertChart,
//   insertMore,
// }: ReportRichEditorProps) {
//   // Convert initial JSON string -> object if needed
//   const contentJSON = React.useMemo(() => {
//     if (format === "json" && initialContent) {
//       try {
//         return JSON.parse(initialContent);
//       } catch {
//         return undefined;
//       }
//     }
//     return undefined;
//   }, [format, initialContent]);
//   const lowlight = createLowlight(all);
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link,
//       ImageExtension,
//       CodeBlockLowlight.configure({ lowlight }),
//     ],
//     content: format === "html" ? initialContent : contentJSON,
//     editorProps: {
//       attributes: {
//         class:
//           "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-2 py-4",
//       },
//     },
//     onUpdate: ({ editor }) => {
//       if (!onChange) return;
//       if (format === "html") {
//         onChange(editor.getHTML());
//       } else {
//         onChange(JSON.stringify(editor.getJSON()));
//       }
//     },
//   });

//   return (
//     <div className="w-full h-[calc(90vh-80px)] border relative flex flex-col">
//       <FormattingToolbar editor={editor} />
//       <div className="mt-2 rounded-md border bg-background flex-1">
//         <EditorContent editor={editor} />
//       </div>
//       {/* Quick Insert under editor (mobile friendly fallback) */}
//       <div className="flex flex-wrap items-center gap-2 sticky bottom-0 mt-auto">
//         <QuickInsertChip
//           icon={<AiIcon className="h-3 w-3" />}
//           label="Ask AI"
//           onClick={askAI}
//         />
//         <QuickInsertChip
//           icon={<ImageIcon className="h-3 w-3" />}
//           label="Image"
//           onClick={insertImage}
//         />
//         <QuickInsertChip
//           icon={<TableIcon className="h-3 w-3" />}
//           label="Table"
//           onClick={insertTable}
//         />
//         <QuickInsertChip
//           icon={<ChartIcon className="h-3 w-3" />}
//           label="Chart"
//           onClick={insertChart}
//         />
//         <QuickInsertChip
//           icon={<MoreHorizontalIcon className="h-3 w-3" />}
//           label="More"
//           onClick={insertMore}
//         />
//       </div>
//     </div>
//   );
// }

// // ------------------------------------------------------------------
// // Quick Insert Chip (reused)
// // ------------------------------------------------------------------
// interface QuickInsertChipProps {
//   icon: React.ReactNode;
//   label: string;
//   onClick?: () => void;
// }
// function QuickInsertChip({ icon, label, onClick }: QuickInsertChipProps) {
//   return (
//     <Button
//       type="button"
//       variant="outline"
//       size="sm"
//       className="gap-2 rounded-full px-3 py-1 h-7 text-xs"
//       onClick={onClick}
//     >
//       {icon}
//       {label}
//     </Button>
//   );
// }

// // ------------------------------------------------------------------
// // Right-hand Meta Editor Panel
// // ------------------------------------------------------------------
// interface EditorPanelProps {
//   state: ReportFormState;
//   onChange: (partial: Partial<ReportFormState>) => void;
//   categories?: Array<{ value: string; label: string }>;
//   categoriesLoading?: boolean;
//   className?: string;
//   reportId?: string;
// }

// function EditorPanel({
//   state,
//   onChange,
//   categories = [],
//   categoriesLoading,
//   className,
//   reportId,
// }: EditorPanelProps) {
//   const noData = !categoriesLoading && categories.length === 0;
//   return (
//     <div
//       className={cn(
//         "sticky top-20 flex h-fit w-full flex-col gap-6 rounded-lg border bg-background p-6 shadow-sm",
//         className
//       )}
//     >
//       <h2 className="text-sm font-semibold">Editor</h2>
//       <div className="flex flex-col gap-4">
//         <div className="space-y-2">
//           <Label className="text-xs font-medium">Thumbnail</Label>
//           <ReportThumbnailUploader
//             reportId={reportId}
//             thumbnailUrl={state.thumbnailUrl}
//             onChange={onChange}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="report-title-sidebar" className="text-xs font-medium">
//             Report Title
//           </Label>
//           <Input
//             id="report-title-sidebar"
//             value={state.title}
//             onChange={(e) => onChange({ title: e.target.value })}
//             placeholder="Report title"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="report-description" className="text-xs font-medium">
//             Description
//           </Label>
//           <Textarea
//             id="report-description"
//             value={state.description}
//             onChange={(e) => onChange({ description: e.target.value })}
//             placeholder="Short description"
//             rows={3}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label className="text-xs font-medium">Category</Label>
//           <Select
//             value={state.category}
//             onValueChange={(v) => onChange({ category: v })}
//             disabled={categoriesLoading || noData}
//           >
//             <SelectTrigger>
//               <SelectValue
//                 placeholder={
//                   categoriesLoading
//                     ? "Loading..."
//                     : noData
//                     ? "No categories"
//                     : "Select category"
//                 }
//               />
//             </SelectTrigger>
//             <SelectContent>
//               {categories.map((c) => (
//                 <SelectItem key={c.value} value={c.value}>
//                   {c.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ------------------------------------------------------------------
// // Top Header Bar (search + actions)
// // ------------------------------------------------------------------
// interface PageHeaderProps {
//   reportId: string;
//   reportTitle: string;
//   onPublish?: () => void;
//   onCompare?: () => void;
// }

// function PageHeader({
//   reportId,
//   reportTitle,
//   onPublish,
//   onCompare,
// }: PageHeaderProps) {
//   return (
//     <div className="flex items-center justify-between gap-4">
//       {/* Search input */}
//       <div className="flex-1 max-w-[320px]">
//         <Input placeholder="Search Anything" />
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-2">
//         <Button size="sm" variant={"gradient"} onClick={onPublish}>
//           Publish
//         </Button>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={onCompare}
//           className="gap-2"
//         >
//           <CopyIcon className="h-4 w-4" />
//           Compare report
//         </Button>
//       </div>
//     </div>
//   );
// }

// // ------------------------------------------------------------------
// // Main Page Component
// // ------------------------------------------------------------------
// const defaultCategories = [
//   { value: "health", label: "Health" },
//   { value: "finance", label: "Finance" },
//   { value: "education", label: "Education" },
//   { value: "politics", label: "Politics" },
// ];

// export default function ReportDraftPage({
//   report,
//   contentFormat = "html",
//   categories: categoriesProp = defaultCategories,
//   onMetaChange,
//   onContentChange,
//   onPublish,
//   onCompareReport,
//   onAskAIRequest,
//   autosaveDelayMs = 1000,
//   showSavingIndicator = true,
//   className,
// }: ReportDraftPageProps) {
//   // ------------------------------------------------------------------
//   // Fetch categories via hook (takes precedence over prop if data exists)
//   // ------------------------------------------------------------------
//   const { data: categoriesData, isLoading: categoriesLoading } =
//     useReportCategory();
//   type AnyCat = any; // we don't know shape; mapping defensively below

//   const { mutate: publishReport, isPending: publishing } = usePublishReport();


//   const categoryOptions = React.useMemo(() => {
//     if (
//       categoriesData &&
//       Array.isArray(categoriesData) &&
//       categoriesData.length > 0
//     ) {
//       return (categoriesData as AnyCat[]).map((c) => ({
//         value: String(c?.id ?? c?.slug ?? c?.value ?? c?.name ?? "unknown"),
//         label: String(c?.name ?? c?.label ?? c?.title ?? c?.id ?? "Unnamed"),
//       }));
//     }
//     // fallback to prop
//     return categoriesProp ?? defaultCategories;
//   }, [categoriesData, categoriesProp]);

//   // Guard safe values
//   const safeTitle = report?.title?.trim?.() ?? "";
//   const safeDescription = report?.description ?? "";
//   const safeCategory = report?.category ?? "";
//   const safeThumb = report?.thumbnailUrl ?? null;
//   const safeBody = report?.body ?? "";

//   const params = useParams();
//   const searchParams = useSearchParams();
//   const reportId = params.id as string;
//   const titleFromQuery = searchParams.get("title");

//   // You'll need to fetch the actual report data
//   // const { data: report, isLoading } = useGetReport(reportId);

//   // For now, creating a mock report structure
//   //   const [report, setReport] = React.useState({
//   //     id: reportId,
//   //     title: titleFromQuery || "Loading...",
//   //     description: null,
//   //     category: null,
//   //     thumbnailUrl: null,
//   //     body: null,
//   //   });

//   // Update report title when query param changes
//   //   React.useEffect(() => {
//   //     if (titleFromQuery) {
//   //       setReport(prev => ({
//   //         ...prev,
//   //         title: titleFromQuery
//   //       }));
//   //     }
//   //   }, [titleFromQuery]);

//   const [form, setForm] = React.useState<ReportFormState>({
//     title: safeTitle,
//     description: safeDescription,
//     category: safeCategory,
//     thumbnailUrl: safeThumb,
//   });

//   // track saving state (meta + content share one indicator for simplicity)
//   const [saving, setSaving] = React.useState(false);
//   const saveTimerRef = React.useRef<NodeJS.Timeout | null>(null);
//   const router = useRouter();

//   // propagate meta changes upward (debounced)
//   const emitMeta = React.useCallback(
//     (next: ReportFormState) => {
//       if (!onMetaChange) return;
//       setSaving(true);
//       if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
//       saveTimerRef.current = setTimeout(() => {
//         onMetaChange(next);
//         setSaving(false);
//       }, autosaveDelayMs);
//     },
//     [onMetaChange, autosaveDelayMs]
//   );

//   const updateForm = (partial: Partial<ReportFormState>) => {
//     setForm((prev) => {
//       const next = { ...prev, ...partial };
//       emitMeta(next);
//       return next;
//     });
//   };

//   // content handling (editor -> parent)
//   const handleContentChange = React.useCallback(
//     (body: string) => {
//       if (!onContentChange) return;
//       setSaving(true);
//       if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
//       saveTimerRef.current = setTimeout(() => {
//         onContentChange(body);
//         setSaving(false);
//       }, autosaveDelayMs);
//     },
//     [onContentChange, autosaveDelayMs]
//   );

//   const handlePublish = async () => {
//     const payload: PublishPayload = {
//       reportId: report.id,
//       title: form.title,
//       description: form.description,
//       category: form.category,
//       thumbnailFile: form.thumbnailFile,
//       thumbnailUrl: form.thumbnailUrl,
//       body: safeBody, // NOTE: You likely want the *current* editor body; see below.
//     } as unknown as PublishPayload; // cast because thumbnailFile optional; align to your backend type.
//     if (onPublish) await onPublish(payload);
//     else console.log("Publish", payload);
//   };

//   const handleCompare = () => {
//     if (onCompareReport) onCompareReport(report.id);
//     else console.log("Compare report", report.id);
//   };

//   // Ask AI example: get current html from body + call parent
//   const handleAskAI = () => {
//     if (onAskAIRequest) {
//       const current = safeBody; // if you want live editor content you'll need to plumb it back
//       const maybe = onAskAIRequest(current);
//       if (maybe instanceof Promise) void maybe.then(() => undefined);
//     } else {
//       console.log("Ask AI clicked");
//     }
//   };

//   // breadcrumbs
//   const crumbs: Crumb[] = [
//     { label: "Reports", href: "/reports" },
//     { label: "My Reports", href: "/reports" },
//     { label: "Draft", onClick: () => router.back() },
//     {
//       label:
//         form.title?.trim() ||
//         safeTitle ||
//         report?.title ||
//         titleFromQuery ||
//         "Untitled",
//     },
//   ];

//   return (
//     <div
//       className={cn(
//         "flex w-full flex-col gap-6 px-4 pb-32 pt-6 md:px-8 lg:px-10 xl:px-16",
//         className
//       )}
//     >
//       {/* Header */}
//       {/* <PageHeader
//         reportId={report?.id || ""}
//         reportTitle={form.title || safeTitle || "Untitled"}
//         onPublish={handlePublish}
//         onCompare={handleCompare}
//       /> */}
//       <div className="flex items-center justify-between">
//         <Breadcrumbs items={crumbs} />
//         <div className="flex items-center gap-2">
//           <Button size="sm" variant={"gradient"} onClick={handlePublish}>
//             Publish
//           </Button>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleCompare}
//             className="gap-2"
//           >
//             <CopyIcon className="h-4 w-4" />
//             Compare report
//           </Button>
//         </div>
//       </div>
//       {/* Breadcrumbs */}

//       {/* Saving indicator */}
//       {/* {showSavingIndicator && (
//         <div className="text-xs text-muted-foreground h-4" role="status">
//           {saving ? "Saving..." : "Saved."}
//         </div>
//       )} */}

//       {/* Content layout: main canvas + editor panel */}
//       <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
//         {/* Main canvas */}
//         <div className="relative flex w-full flex-col items-stretch gap-6 overflow-hidden">
//           {/* Title Input (big) */}
//           <input
//             type="text"
//             value={form.title}
//             onChange={(e) => updateForm({ title: e.target.value })}
//             placeholder="Add a title..."
//             className="w-full bg-transparent text-3xl font-semibold tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
//           />

//           {/* Rich text editor */}
//           <ReportRichEditor
//             initialContent={safeBody}
//             format={contentFormat}
//             onChange={handleContentChange}
//             askAI={handleAskAI}
//             insertImage={() => console.log("Insert image")}
//             insertTable={() => console.log("Insert table")}
//             insertChart={() => console.log("Insert chart")}
//             insertMore={() => console.log("Insert more")}
//           />
//         </div>

//         {/* Meta Editor Panel */}
//         <EditorPanel
//           state={form}
//           onChange={updateForm}
//           categories={categoryOptions}
//           categoriesLoading={categoriesLoading}
//         />
//       </div>
//     </div>
//   );
// }

// // ------------------------------------------------------------------
// // Skeleton (for suspense/loading states)
// // ------------------------------------------------------------------
// export function ReportDraftPageSkeleton() {
//   return (
//     <div className="flex w-full flex-col gap-6 px-4 pb-20 pt-6 md:px-8 lg:px-10 xl:px-16">
//       <div className="flex items-center justify-between gap-4">
//         <div className="h-9 w-[320px] animate-pulse rounded-md bg-muted" />
//         <div className="flex items-center gap-2">
//           <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
//           <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
//           <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
//           <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
//           <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
//         </div>
//       </div>
//       <div className="h-4 w-64 animate-pulse rounded bg-muted" />
//       <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
//         <div className="min-h-[60vh] animate-pulse rounded-md bg-muted/50" />
//         <div className="hidden h-[480px] animate-pulse rounded-md bg-muted/50 lg:block" />
//       </div>
//     </div>
//   );
// }


// "use client";

// import * as React from "react";
// import NextLink from "next/link";
// import Image from "next/image";

// // UI Primitives (update the import paths to match your project)
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// // Data hook
// import { useReportCategory } from "@/components/reports/queries/useCategories";
// import { Input } from "@/components/ui/shadcn-input";
// import { Textarea } from "@/components/ui/shadcn-textarea";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import { usePublishReport, useReportMediaUpload } from "@/components/reports/queries/usePostOnboard";

// // Lucide icons
// import {
//   Upload as UploadIcon,
//   Bell as BellIcon,
//   Copy as CopyIcon,
//   MoreHorizontal as MoreHorizontalIcon,
//   Image as ImageIcon,
//   Table as TableIcon,
//   BarChart3 as ChartIcon,
//   Sparkles as AiIcon,
//   Bold as BoldIcon,
//   Italic as ItalicIcon,
//   Underline as UnderlineIcon,
//   Strikethrough as StrikeIcon,
//   Heading1 as H1Icon,
//   Heading2 as H2Icon,
//   List as BulletIcon,
//   ListOrdered as OrderedIcon,
//   Quote as QuoteIcon,
//   Code2 as CodeIcon,
//   Undo2 as UndoIcon,
//   Redo2 as RedoIcon,
// } from "lucide-react";

// // TipTap imports
// import { useEditor, EditorContent, type Editor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";
// import ImageExtension from "@tiptap/extension-image";
// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import { createLowlight, all } from "lowlight";

// // Types
// export interface ReportDraftData {
//   id: string;
//   title: string;
//   description?: string | null;
//   category?: string | null;
//   thumbnailUrl?: string | null;
//   body?: string | null;
// }

// interface ReportDraftPageProps {
//   report: ReportDraftData;
//   contentFormat?: "html" | "json";
//   categories?: Array<{ value: string; label: string }>;
//   onMetaChange?: (data: ReportFormState) => void;
//   onContentChange?: (body: string) => void;
//   onPublish?: (data: PublishPayload) => Promise<void> | void;
//   onCompareReport?: (reportId: string) => void;
//   onAskAIRequest?: (currentContentHtml: string) => Promise<string> | string | void;
//   autosaveDelayMs?: number;
//   showSavingIndicator?: boolean;
//   className?: string;
// }

// interface ReportFormState {
//   title: string;
//   description: string;
//   category: string;
//   thumbnailFile?: File | null;
//   thumbnailUrl?: string | null;
// }

// export interface PublishPayload extends ReportFormState {
//   body: string;
//   reportId: string;
// }

// interface PublishReportPayload {
//   report_id: string;
//   title: string;
//   description: string;
//   categories: string[];
//   fields_of_interest: string[];
//   summarized_by: "ai" | "manual";
//   content: string;
//   thumbnail: string;
// }

// // Breadcrumbs
// interface Crumb {
//   label: string;
//   href?: string;
//   onClick?: () => void;
// }

// function Breadcrumbs({ items }: { items: Crumb[] }) {
//   return (
//     <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
//       <ol className="flex items-center gap-1 flex-wrap">
//         {items.map((c, i) => {
//           const isLast = i === items.length - 1;
//           return (
//             <li key={i} className="flex items-center gap-1">
//               {c.href && !isLast ? (
//                 <NextLink
//                   href={c.href}
//                   className={cn("transition-colors hover:text-foreground")}
//                 >
//                   {c.label}
//                 </NextLink>
//               ) : c.onClick && !isLast ? (
//                 <button
//                   onClick={c.onClick}
//                   type="button"
//                   className="transition-colors hover:text-foreground"
//                 >
//                   {c.label}
//                 </button>
//               ) : (
//                 <span
//                   className={cn(
//                     "transition-colors",
//                     isLast && "text-foreground font-medium"
//                   )}
//                 >
//                   {c.label}
//                 </span>
//               )}
//               {!isLast && <span className="mx-1">/</span>}
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// }

// // Thumbnail Dropzone
// interface ThumbnailDropzoneProps {
//   valueUrl?: string | null;
//   onChangeFile: (file: File | null) => void;
//   className?: string;
// }

// function ThumbnailDropzone({
//   valueUrl,
//   onChangeFile,
//   className,
// }: ThumbnailDropzoneProps) {
//   const inputRef = React.useRef<HTMLInputElement | null>(null);
//   const [isDragging, setDragging] = React.useState(false);
//   const [preview, setPreview] = React.useState<string | null>(valueUrl ?? null);

//   React.useEffect(() => {
//     setPreview(valueUrl ?? null);
//   }, [valueUrl]);

//   const handleFiles = React.useCallback(
//     (files: FileList | null) => {
//       if (!files || files.length === 0) {
//         onChangeFile(null);
//         setPreview(null);
//         return;
//       }
//       const file = files[0];
//       onChangeFile(file);
//       const url = URL.createObjectURL(file);
//       setPreview(url);
//     },
//     [onChangeFile]
//   );

//   const openFilePicker = () => inputRef.current?.click();
//   const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(true);
//   };
//   const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(false);
//   };
//   const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(false);
//     handleFiles(e.dataTransfer.files);
//   };

//   return (
//     <div className={cn("w-full", className)}>
//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={(e) => handleFiles(e.target.files)}
//       />
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={openFilePicker}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") openFilePicker();
//         }}
//         onDragOver={onDragOver}
//         onDragLeave={onDragLeave}
//         onDrop={onDrop}
//         className={cn(
//           "flex flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 p-6 text-center cursor-pointer transition-colors",
//           isDragging && "bg-muted"
//         )}
//       >
//         {preview ? (
//           <div className="relative aspect-video w-full max-w-[240px]">
//             <img
//               src={preview}
//               alt="Thumbnail preview"
//               className="h-full w-full object-cover rounded-md"
//             />
//           </div>
//         ) : (
//           <>
//             <UploadIcon className="h-6 w-6 text-muted-foreground" />
//             <p className="mt-2 text-sm font-medium">
//               Click to Upload your image
//             </p>
//             <p className="text-xs text-muted-foreground">or drag and drop</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// interface ReportThumbnailUploaderProps {
//   reportId?: string;
//   thumbnailUrl?: string | null;
//   onChange: (partial: Partial<ReportFormState>) => void;
//   className?: string;
//   extraFields?: Record<string, any>;
// }

// function ReportThumbnailUploader({
//   reportId,
//   thumbnailUrl,
//   onChange,
//   className,
//   extraFields,
// }: ReportThumbnailUploaderProps) {
//   const {
//     mutate: uploadMedia,
//     isPending,
//     error,
//     data,
//     progress,
//   } = useReportMediaUpload();

//   const uploading = isPending;

//   const handleFile = React.useCallback(
//     (file: File | null) => {
//       onChange({ thumbnailFile: file });
//       if (!file || !reportId) return;
//       uploadMedia(
//         {
//           reportId,
//           files: [file],
//           extraFields: { is_thumbnail: "true", ...extraFields },
//         },
//         {
//           onSuccess: (res) => {
//             const uploaded = res.media?.[0];
//             if (uploaded?.url) {
//               onChange({ thumbnailUrl: uploaded.url });
//             }
//           },
//         }
//       );
//     },
//     [onChange, reportId, uploadMedia, extraFields]
//   );

//   return (
//     <div className={className}>
//       <ThumbnailDropzone
//         valueUrl={thumbnailUrl}
//         onChangeFile={handleFile}
//         className="w-full"
//       />
//       {reportId && (
//         <>
//           {uploading && (
//             <div className="mt-2 text-[11px] text-muted-foreground">
//               Uploading… {progress}%
//               <div className="mt-1 h-1 w-full rounded bg-muted">
//                 <div
//                   className="h-1 rounded bg-primary transition-all"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>
//           )}
//           {error && (
//             <div className="mt-2 text-[11px] text-destructive">
//               Failed to upload: {error.message}
//             </div>
//           )}
//           {data?.success && !uploading && (
//             <div className="mt-2 text-[11px] text-green-600">
//               Thumbnail uploaded.
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// // Formatting Toolbar Button
// interface ToolbarButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   active?: boolean;
//   children: React.ReactNode;
//   label: string;
// }

// function ToolbarButton({
//   active,
//   children,
//   label,
//   className,
//   ...rest
// }: ToolbarButtonProps) {
//   return (
//     <Button
//       type="button"
//       variant={active ? "default" : "ghost"}
//       aria-label={label}
//       title={label}
//       className={cn("h-7 w-7 p-0", className)}
//       {...rest}
//     >
//       {children}
//     </Button>
//   );
// }

// // Formatting Toolbar
// interface FormattingToolbarProps {
//   editor: Editor | null;
// }

// function FormattingToolbar({ editor }: FormattingToolbarProps) {
//   if (!editor) return null;
//   return (
//     <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm sticky top-0 z-10">
//       <ToolbarButton
//         label="Bold"
//         active={editor.isActive("bold")}
//         onClick={() => editor.chain().focus().toggleBold().run()}
//       >
//         <BoldIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Italic"
//         active={editor.isActive("italic")}
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//       >
//         <ItalicIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Underline"
//         active={editor.isActive("underline")}
//         onClick={() => editor.chain().focus().toggleUnderline().run()}
//       >
//         <UnderlineIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Strike"
//         active={editor.isActive("strike")}
//         onClick={() => editor.chain().focus().toggleStrike().run()}
//       >
//         <StrikeIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <span className="mx-1 h-4 w-px bg-border" />
//       <ToolbarButton
//         label="Heading 1"
//         active={editor.isActive("heading", { level: 1 })}
//         onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//       >
//         <H1Icon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Heading 2"
//         active={editor.isActive("heading", { level: 2 })}
//         onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//       >
//         <H2Icon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <span className="mx-1 h-4 w-px bg-border" />
//       <ToolbarButton
//         label="Bullet List"
//         active={editor.isActive("bulletList")}
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//       >
//         <BulletIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Ordered List"
//         active={editor.isActive("orderedList")}
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//       >
//         <OrderedIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Block Quote"
//         active={editor.isActive("blockquote")}
//         onClick={() => editor.chain().focus().toggleBlockquote().run()}
//       >
//         <QuoteIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Code Block"
//         active={editor.isActive("codeBlock")}
//         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//       >
//         <CodeIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <span className="mx-1 h-4 w-px bg-border" />
//       <ToolbarButton
//         label="Undo"
//         onClick={() => editor.chain().focus().undo().run()}
//       >
//         <UndoIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//       <ToolbarButton
//         label="Redo"
//         onClick={() => editor.chain().focus().redo().run()}
//       >
//         <RedoIcon className="h-3.5 w-3.5" />
//       </ToolbarButton>
//     </div>
//   );
// }

// // Rich Editor Wrapper
// interface ReportRichEditorProps {
//   initialContent?: string;
//   format?: "html" | "json";
//   onChange?: (content: string) => void;
//   askAI?: (() => void) | undefined;
//   insertImage?: (() => void) | undefined;
//   insertTable?: (() => void) | undefined;
//   insertChart?: (() => void) | undefined;
//   insertMore?: () => void;
// }

// function ReportRichEditor({
//   initialContent,
//   format = "html",
//   onChange,
//   askAI,
//   insertImage,
//   insertTable,
//   insertChart,
//   insertMore,
// }: ReportRichEditorProps) {
//   const contentJSON = React.useMemo(() => {
//     if (format === "json" && initialContent) {
//       try {
//         return JSON.parse(initialContent);
//       } catch {
//         return undefined;
//       }
//     }
//     return undefined;
//   }, [format, initialContent]);
//   const lowlight = createLowlight(all);
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link,
//       ImageExtension,
//       CodeBlockLowlight.configure({ lowlight }),
//     ],
//     content: format === "html" ? initialContent : contentJSON,
//     editorProps: {
//       attributes: {
//         class:
//           "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-2 py-4",
//       },
//     },
//     onUpdate: ({ editor }) => {
//       if (!onChange) return;
//       if (format === "html") {
//         onChange(editor.getHTML());
//       } else {
//         onChange(JSON.stringify(editor.getJSON()));
//       }
//     },
//   });

//   return (
//     <div className="w-full h-[calc(90vh-80px)] border relative flex flex-col">
//       <FormattingToolbar editor={editor} />
//       <div className="mt-2 rounded-md border bg-background flex-1">
//         <EditorContent editor={editor} />
//       </div>
//       <div className="flex flex-wrap items-center gap-2 sticky bottom-0 mt-auto">
//         <QuickInsertChip
//           icon={<AiIcon className="h-3 w-3" />}
//           label="Ask AI"
//           onClick={askAI}
//         />
//         <QuickInsertChip
//           icon={<ImageIcon className="h-3 w-3" />}
//           label="Image"
//           onClick={insertImage}
//         />
//         <QuickInsertChip
//           icon={<TableIcon className="h-3 w-3" />}
//           label="Table"
//           onClick={insertTable}
//         />
//         <QuickInsertChip
//           icon={<ChartIcon className="h-3 w-3" />}
//           label="Chart"
//           onClick={insertChart}
//         />
//         <QuickInsertChip
//           icon={<MoreHorizontalIcon className="h-3 w-3" />}
//           label="More"
//           onClick={insertMore}
//         />
//       </div>
//     </div>
//   );
// }

// // Quick Insert Chip
// interface QuickInsertChipProps {
//   icon: React.ReactNode;
//   label: string;
//   onClick?: () => void;
// }

// function QuickInsertChip({ icon, label, onClick }: QuickInsertChipProps) {
//   return (
//     <Button
//       type="button"
//       variant="outline"
//       size="sm"
//       className="gap-2 rounded-full px-3 py-1 h-7 text-xs"
//       onClick={onClick}
//     >
//       {icon}
//       {label}
//     </Button>
//   );
// }

// // Right-hand Meta Editor Panel
// interface EditorPanelProps {
//   state: ReportFormState;
//   onChange: (partial: Partial<ReportFormState>) => void;
//   categories?: Array<{ value: string; label: string }>;
//   categoriesLoading?: boolean;
//   className?: string;
//   reportId?: string;
// }

// function EditorPanel({
//   state,
//   onChange,
//   categories = [],
//   categoriesLoading,
//   className,
//   reportId,
// }: EditorPanelProps) {
//   const noData = !categoriesLoading && categories.length === 0;
//   return (
//     <div
//       className={cn(
//         "sticky top-20 flex h-fit w-full flex-col gap-6 rounded-lg border bg-background p-6 shadow-sm",
//         className
//       )}
//     >
//       <h2 className="text-sm font-semibold">Editor</h2>
//       <div className="flex flex-col gap-4">
//         <div className="space-y-2">
//           <Label className="text-xs font-medium">Thumbnail</Label>
//           <ReportThumbnailUploader
//             reportId={reportId}
//             thumbnailUrl={state.thumbnailUrl}
//             onChange={onChange}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="report-title-sidebar" className="text-xs font-medium">
//             Report Title
//           </Label>
//           <Input
//             id="report-title-sidebar"
//             value={state.title}
//             onChange={(e) => onChange({ title: e.target.value })}
//             placeholder="Report title"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="report-description" className="text-xs font-medium">
//             Description
//           </Label>
//           <Textarea
//             id="report-description"
//             value={state.description}
//             onChange={(e) => onChange({ description: e.target.value })}
//             placeholder="Short description"
//             rows={3}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label className="text-xs font-medium">Category</Label>
//           <Select
//             value={state.category}
//             onValueChange={(v) => onChange({ category: v })}
//             disabled={categoriesLoading || noData}
//           >
//             <SelectTrigger>
//               <SelectValue
//                 placeholder={
//                   categoriesLoading
//                     ? "Loading..."
//                     : noData
//                     ? "No categories"
//                     : "Select category"
//                 }
//               />
//             </SelectTrigger>
//             <SelectContent>
//               {categories.map((c) => (
//                 <SelectItem key={c.value} value={c.value}>
//                   {c.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Top Header Bar
// interface PageHeaderProps {
//   reportId: string;
//   reportTitle: string;
//   onPublish?: () => void;
//   onCompare?: () => void;
//   isPublishDisabled?: boolean;
// }

// function PageHeader({
//   reportId,
//   reportTitle,
//   onPublish,
//   onCompare,
//   isPublishDisabled,
// }: PageHeaderProps) {
//   return (
//     <div className="flex items-center justify-between gap-4">
//       <div className="flex-1 max-w-[320px]">
//         <Input placeholder="Search Anything" />
//       </div>
//       <div className="flex items-center gap-2">
//         <Button
//           size="sm"
//           variant="gradient"
//           onClick={onPublish}
//           disabled={isPublishDisabled}
//         >
//           Publish
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={onCompare}
//           className="gap-2"
//         >
//           <CopyIcon className="h-4 w-4" />
//           Compare report
//         </Button>
//       </div>
//     </div>
//   );
// }

// // Main Page Component
// const defaultCategories = [
//   { value: "health", label: "Health" },
//   { value: "finance", label: "Finance" },
//   { value: "education", label: "Education" },
//   { value: "politics", label: "Politics" },
// ];

// export default function ReportDraftPage({
//   report,
//   contentFormat = "html",
//   categories: categoriesProp = defaultCategories,
//   onMetaChange,
//   onContentChange,
//   onPublish,
//   onCompareReport,
//   onAskAIRequest,
//   autosaveDelayMs = 1000,
//   showSavingIndicator = true,
//   className,
// }: ReportDraftPageProps) {
//   const { data: categoriesData, isLoading: categoriesLoading } = useReportCategory();
//   type AnyCat = any;

//   const { mutate: publishReport, isPending: publishing } = usePublishReport();
//   const [currentContent, setCurrentContent] = React.useState(report?.body ?? "");

//   const categoryOptions = React.useMemo(() => {
//     if (
//       categoriesData &&
//       Array.isArray(categoriesData) &&
//       categoriesData.length > 0
//     ) {
//       return (categoriesData as AnyCat[]).map((c) => ({
//         value: String(c?.id ?? c?.slug ?? c?.value ?? c?.name ?? "unknown"),
//         label: String(c?.name ?? c?.label ?? c?.title ?? c?.id ?? "Unnamed"),
//       }));
//     }
//     return categoriesProp ?? defaultCategories;
//   }, [categoriesData, categoriesProp]);

//   const safeTitle = report?.title?.trim?.() ?? "";
//   const safeDescription = report?.description ?? "";
//   const safeCategory = report?.category ?? "";
//   const safeThumb = report?.thumbnailUrl ?? null;
//   const safeBody = report?.body ?? "";

//   const params = useParams();
//   const searchParams = useSearchParams();
//   const reportId = params.id as string;
//   const titleFromQuery = searchParams.get("title");

//   const [form, setForm] = React.useState<ReportFormState>({
//     title: safeTitle,
//     description: safeDescription,
//     category: safeCategory,
//     thumbnailUrl: safeThumb,
//   });

//   const [saving, setSaving] = React.useState(false);
//   const saveTimerRef = React.useRef<NodeJS.Timeout | null>(null);
//   const router = useRouter();

//   // Validation for Publish button
//   const isPublishDisabled = React.useMemo(() => {
//     return (
//       !form.title?.trim() ||
//       !form.description?.trim() ||
//       !form.category ||
//       !form.thumbnailUrl ||
//       !currentContent?.trim()
//     );
//   }, [form, currentContent]);

//   const emitMeta = React.useCallback(
//     (next: ReportFormState) => {
//       if (!onMetaChange) return;
//       setSaving(true);
//       if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
//       saveTimerRef.current = setTimeout(() => {
//         onMetaChange(next);
//         setSaving(false);
//       }, autosaveDelayMs);
//     },
//     [onMetaChange, autosaveDelayMs]
//   );

//   const updateForm = (partial: Partial<ReportFormState>) => {
//     setForm((prev) => {
//       const next = { ...prev, ...partial };
//       emitMeta(next);
//       return next;
//     });
//   };

//   const handleContentChange = React.useCallback(
//     (body: string) => {
//       setCurrentContent(body);
//       if (!onContentChange) return;
//       setSaving(true);
//       if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
//       saveTimerRef.current = setTimeout(() => {
//         onContentChange(body);
//         setSaving(false);
//       }, autosaveDelayMs);
//     },
//     [onContentChange, autosaveDelayMs]
//   );

//   const handlePublish = async () => {
//     const payload: PublishReportPayload = {
//       report_id: report?.id,
//       title: form.title,
//       description: form.description,
//       categories: [form.category],
//       fields_of_interest: [], // Assuming empty for now; adjust based on your data
//       summarized_by: "manual", // Default to manual; adjust as needed
//       content: currentContent,
//       thumbnail: form.thumbnailUrl ?? "",
//     };

//     publishReport(payload, {
//       onSuccess: () => {
//         if (onPublish) onPublish(payload as unknown as PublishPayload);
//       },
//       onError: (error) => {
//         console.error("Failed to publish report:", error);
//       },
//     });
//   };

//   const handleCompare = () => {
//     if (onCompareReport) onCompareReport(report.id);
//     else console.log("Compare report", report.id);
//   };

//   const handleAskAI = () => {
//     if (onAskAIRequest) {
//       const current = currentContent;
//       const maybe = onAskAIRequest(current);
//       if (maybe instanceof Promise) void maybe.then(() => undefined);
//     } else {
//       console.log("Ask AI clicked");
//     }
//   };

//   const crumbs: Crumb[] = [
//     { label: "Reports", href: "/reports" },
//     { label: "My Reports", href: "/reports" },
//     { label: "Draft", onClick: () => router.back() },
//     {
//       label:
//         form.title?.trim() ||
//         safeTitle ||
//         report?.title ||
//         titleFromQuery ||
//         "Untitled",
//     },
//   ];

//   return (
//     <div
//       className={cn(
//         "flex w-full flex-col gap-6 px-4 pb-32 pt-6 md:px-8 lg:px-10 xl:px-16",
//         className
//       )}
//     >
//       <div className="flex items-center justify-between">
//         <Breadcrumbs items={crumbs} />
//         <div className="flex items-center gap-2">
//           <Button
//             size="sm"
//             variant="gradient"
//             onClick={handlePublish}
//             // disabled={isPublishDisabled}
//           >
//             Publish
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleCompare}
//             className="gap-2"
//           >
//             <CopyIcon className="h-4 w-4" />
//             Compare report
//           </Button>
//         </div>
//       </div>
//       {showSavingIndicator && (
//         <div className="text-xs text-muted-foreground h-4" role="status">
//           {saving ? "Saving..." : "Saved."}
//         </div>
//       )}
//       <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
//         <div className="relative flex w-full flex-col items-stretch gap-6 overflow-hidden">
//           <input
//             type="text"
//             value={form.title}
//             onChange={(e) => updateForm({ title: e.target.value })}
//             placeholder="Add a title..."
//             className="w-full bg-transparent text-3xl font-semibold tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
//           />
//           <ReportRichEditor
//             initialContent={safeBody}
//             format={contentFormat}
//             onChange={handleContentChange}
//             askAI={handleAskAI}
//             insertImage={() => console.log("Insert image")}
//             insertTable={() => console.log("Insert table")}
//             insertChart={() => console.log("Insert chart")}
//             insertMore={() => console.log("Insert more")}
//           />
//         </div>
//         <EditorPanel
//           state={form}
//           onChange={updateForm}
//           categories={categoryOptions}
//           categoriesLoading={categoriesLoading}
//         />
//       </div>
//     </div>
//   );
// }

// export function ReportDraftPageSkeleton() {
//   return (
//     <div className="flex w-full flex-col gap-6 px-4 pb-20 pt-6 md:px-8 lg:px-10 xl:px-16">
//       <div className="flex items-center justify-between gap-4">
//         <div className="h-9 w-[320px] animate-pulse rounded-md bg-muted" />
//         <div className="flex items-center gap-2">
//           <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
//           <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
//           <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
//           <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
//           <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
//         </div>
//       </div>
//       <div className="h-4 w-64 animate-pulse rounded bg-muted" />
//       <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
//         <div className="min-h-[60vh] animate-pulse rounded-md bg-muted/50" />
//         <div className="hidden h-[480px] animate-pulse rounded-md bg-muted/50 lg:block" />
//       </div>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import NextLink from "next/link";
import Image from "next/image";

// UI Primitives (update the import paths to match your project)
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Data hooks
import { useReportCategory, useReportInterests } from "@/components/reports/queries/useCategories";
import { Input } from "@/components/ui/shadcn-input";
import { Textarea } from "@/components/ui/shadcn-textarea";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePublishReport, useReportMediaUpload } from "@/components/reports/queries/usePostOnboard";

// Lucide icons
import {
  Upload as UploadIcon,
  Bell as BellIcon,
  Copy as CopyIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Image as ImageIcon,
  Table as TableIcon,
  BarChart3 as ChartIcon,
  Sparkles as AiIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikeIcon,
  Heading1 as H1Icon,
  Heading2 as H2Icon,
  List as BulletIcon,
  ListOrdered as OrderedIcon,
  Quote as QuoteIcon,
  Code2 as CodeIcon,
  Undo2 as UndoIcon,
  Redo2 as RedoIcon,
  Check as CheckIcon, // <-- NEW
} from "lucide-react";

// TipTap imports
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, all } from "lowlight";
import { Checkbox } from "@/components/shop/components/Checkbox";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ReportDraftData {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null; // this should store the *ID* that backend expects
  thumbnailUrl?: string | null;
  body?: string | null;
  interests?: string[] | null; // <-- NEW (IDs)
}

interface ReportDraftPageProps {
  report: ReportDraftData;
  contentFormat?: "html" | "json";
  categories?: Array<{ value: string; label: string }>;
  interests?: Array<{ value: string; label: string }>; // <-- NEW (optional override)
  onMetaChange?: (data: ReportFormState) => void;
  onContentChange?: (body: string) => void;
  onPublish?: (data: PublishPayload) => Promise<void> | void;
  onCompareReport?: (reportId: string) => void;
  onAskAIRequest?: (currentContentHtml: string) => Promise<string> | string | void;
  autosaveDelayMs?: number;
  showSavingIndicator?: boolean;
  className?: string;
}

interface ReportFormState {
  title: string;
  description: string;
  category: string; // ID
  interests: string[]; // <-- NEW (IDs)
  thumbnailFile?: File | null;
  thumbnailUrl?: string | null;
}

export interface PublishPayload extends ReportFormState {
  body: string;
  reportId: string;
}

interface PublishReportPayload {
  report_id: string; // required
  title: string;
  description: string;
  categories: string[]; // array of category IDs
  fields_of_interest: string[]; // array of interest IDs
  summarized_by: "ai" | "manual";
  content: string; // html/json string
  thumbnail: string; // URL
}

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------
interface Crumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.href && !isLast ? (
                <NextLink
                  href={c.href}
                  className={cn("transition-colors hover:text-foreground")}
                >
                  {c.label}
                </NextLink>
              ) : c.onClick && !isLast ? (
                <button
                  onClick={c.onClick}
                  type="button"
                  className="transition-colors hover:text-foreground"
                >
                  {c.label}
                </button>
              ) : (
                <span
                  className={cn(
                    "transition-colors",
                    isLast && "text-foreground font-medium"
                  )}
                >
                  {c.label}
                </span>
              )}
              {!isLast && <span className="mx-1">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Thumbnail Dropzone
// ---------------------------------------------------------------------------
interface ThumbnailDropzoneProps {
  valueUrl?: string | null;
  onChangeFile: (file: File | null) => void;
  className?: string;
}

function ThumbnailDropzone({ valueUrl, onChangeFile, className }: ThumbnailDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(valueUrl ?? null);

  React.useEffect(() => {
    setPreview(valueUrl ?? null);
  }, [valueUrl]);

  const handleFiles = React.useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        onChangeFile(null);
        setPreview(null);
        return;
      }
      const file = files[0];
      onChangeFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    },
    [onChangeFile]
  );

  const openFilePicker = () => inputRef.current?.click();
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openFilePicker();
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 p-6 text-center cursor-pointer transition-colors",
          isDragging && "bg-muted"
        )}
      >
        {preview ? (
          <div className="relative aspect-video w-full max-w-[240px]">
            <img
              src={preview}
              alt="Thumbnail preview"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        ) : (
          <>
            <UploadIcon className="h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Click to Upload your image</p>
            <p className="text-xs text-muted-foreground">or drag and drop</p>
          </>
        )}
      </div>
    </div>
  );
}

interface ReportThumbnailUploaderProps {
  reportId?: string;
  thumbnailUrl?: string | null;
  onChange: (partial: Partial<ReportFormState>) => void;
  className?: string;
  extraFields?: Record<string, any>;
}

function ReportThumbnailUploader({ reportId, thumbnailUrl, onChange, className, extraFields }: ReportThumbnailUploaderProps) {
  const { mutate: uploadMedia, isPending, error, data, progress } = useReportMediaUpload();
  const uploading = isPending;

  const handleFile = React.useCallback(
    (file: File | null) => {
      onChange({ thumbnailFile: file });
      if (!file || !reportId) return;
      uploadMedia(
        {
          reportId,
          files: [file],
          extraFields: { is_thumbnail: "true", ...extraFields },
        },
        {
          onSuccess: (res: any) => {
            // Backend may return different shapes:
            // 1. { success, message, data: { url, type } }
            // 2. { success, message, media: [ { url, ... } ] }
            // 3. { url: string }
            const url =
              res?.data?.url ??
              res?.media?.[0]?.url ??
              res?.url ??
              null;

            if (url) {
              onChange({ thumbnailUrl: url });
            } else {
              console.warn("Upload succeeded but no URL found in response", res);
            }
          },
        }
      );
    },
    [onChange, reportId, uploadMedia, extraFields]
  );

  return (
    <div className={className}>
      <ThumbnailDropzone valueUrl={thumbnailUrl} onChangeFile={handleFile} className="w-full" />
      {reportId && (
        <>
          {uploading && (
            <div className="mt-2 text-[11px] text-muted-foreground">
              Uploading… {progress}%
              <div className="mt-1 h-1 w-full rounded bg-muted">
                <div
                  className="h-1 rounded bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {error && (
            <div className="mt-2 text-[11px] text-destructive">Failed to upload: {error.message}</div>
          )}
          {data?.success && !uploading && (
            <div className="mt-2 text-[11px] text-green-600">Thumbnail uploaded.</div>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formatting Toolbar Button
// ---------------------------------------------------------------------------
interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
  label: string;
}

function ToolbarButton({ active, children, label, className, ...rest }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      aria-label={label}
      title={label}
      className={cn("h-7 w-7 p-0", className)}
      {...rest}
    >
      {children}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Formatting Toolbar
// ---------------------------------------------------------------------------
interface FormattingToolbarProps {
  editor: Editor | null;
}

function FormattingToolbar({ editor }: FormattingToolbarProps) {
  if (!editor) return null;
  return (
    <div className="flex items-center gap-1 rounded-md border bg-background p-1 shadow-sm sticky top-0 z-10">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Strike" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <StrikeIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-border" />
      <ToolbarButton label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <H1Icon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <H2Icon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-border" />
      <ToolbarButton label="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <BulletIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <OrderedIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Block Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <QuoteIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Code Block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <CodeIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-border" />
      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <UndoIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <RedoIcon className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rich Editor Wrapper
// ---------------------------------------------------------------------------
interface ReportRichEditorProps {
  initialContent?: string;
  format?: "html" | "json";
  onChange?: (content: string) => void;
  askAI?: (() => void) | undefined;
  insertImage?: (() => void) | undefined;
  insertTable?: (() => void) | undefined;
  insertChart?: (() => void) | undefined;
  insertMore?: () => void;
}

function ReportRichEditor({ initialContent, format = "html", onChange, askAI, insertImage, insertTable, insertChart, insertMore }: ReportRichEditorProps) {
  const contentJSON = React.useMemo(() => {
    if (format === "json" && initialContent) {
      try {
        return JSON.parse(initialContent);
      } catch {
        return undefined;
      }
    }
    return undefined;
  }, [format, initialContent]);
  const lowlight = createLowlight(all);
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link, ImageExtension, CodeBlockLowlight.configure({ lowlight })],
    content: format === "html" ? initialContent : contentJSON,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-2 py-4",
      },
    },
    onUpdate: ({ editor }) => {
      if (!onChange) return;
      if (format === "html") {
        onChange(editor.getHTML());
      } else {
        onChange(JSON.stringify(editor.getJSON()));
      }
    },
  });

  return (
    <div className="w-full h-[calc(90vh-80px)] relative flex flex-col">
      <FormattingToolbar editor={editor} />
      <div className="mt-2 rounded-md border bg-background flex-1">
        <EditorContent editor={editor} />
      </div>
      <div className="flex flex-wrap items-center gap-2 sticky bottom-0 mt-auto">
        <QuickInsertChip icon={<AiIcon className="h-3 w-3" />} label="Ask AI" onClick={askAI} />
        <QuickInsertChip icon={<ImageIcon className="h-3 w-3" />} label="Image" onClick={insertImage} />
        <QuickInsertChip icon={<TableIcon className="h-3 w-3" />} label="Table" onClick={insertTable} />
        <QuickInsertChip icon={<ChartIcon className="h-3 w-3" />} label="Chart" onClick={insertChart} />
        <QuickInsertChip icon={<MoreHorizontalIcon className="h-3 w-3" />} label="More" onClick={insertMore} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick Insert Chip
// ---------------------------------------------------------------------------
interface QuickInsertChipProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function QuickInsertChip({ icon, label, onClick }: QuickInsertChipProps) {
  return (
    <Button type="button" variant="outline" size="sm" className="gap-2 rounded-full px-3 py-1 h-7 text-xs" onClick={onClick}>
      {icon}
      {label}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Interests Multi-Select (simple checklist UI)
// ---------------------------------------------------------------------------
interface InterestsSelectorOption {
  value: string;
  label: string;
}

interface InterestsSelectorProps {
  options: InterestsSelectorOption[];
  selected: string[];
  onChange: (nextSelected: string[]) => void;
  disabled?: boolean;
  className?: string;
}

function InterestsSelector({ options, selected, onChange, disabled, className }: InterestsSelectorProps) {
  const toggle = (v: string) => {
    if (disabled) return;
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
  };

  // Pre-compute label string for collapsed view
  const summary = React.useMemo(() => {
    if (selected.length === 0) return "Select interests";
    if (selected.length === 1) {
      const opt = options.find((o) => o.value === selected[0]);
      return opt?.label ?? "1 selected";
    }
    return `${selected.length} selected`;
  }, [options, selected]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-left text-sm",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={(e) => {
          e.preventDefault();
          // expand/collapse by toggling hidden list below
          const list = (e.currentTarget.nextSibling as HTMLElement) ?? null;
          if (list) list.classList.toggle("hidden");
        }}
      >
        {summary}
        <MoreHorizontalIcon className="h-4 w-4 shrink-0 opacity-60" />
      </button>
      <div className="hidden max-h-48 overflow-y-auto rounded-md border bg-muted/40 p-2">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              className="flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted"
            >
              <Checkbox checked={checked} onCheckedChange={() => toggle(opt.value)} id={`interest-${opt.value}`} />
              <span>{opt.label}</span>
            </label>
          );
        })}
        {options.length === 0 && (
          <div className="px-2 py-1 text-xs text-muted-foreground">No interests.</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Right-hand Meta Editor Panel
// ---------------------------------------------------------------------------
interface EditorPanelProps {
  state: ReportFormState;
  onChange: (partial: Partial<ReportFormState>) => void;
  categories?: Array<{ value: string; label: string }>;
  categoriesLoading?: boolean;
  interestsOptions?: Array<{ value: string; label: string }>; // <-- NEW
  interestsLoading?: boolean; // <-- NEW
  className?: string;
  reportId?: string;
}

function EditorPanel({ state, onChange, categories = [], categoriesLoading, interestsOptions = [], interestsLoading, className, reportId }: EditorPanelProps) {
  const noCatData = !categoriesLoading && categories.length === 0;
  const noIntData = !interestsLoading && interestsOptions.length === 0;
  return (
    <div
      className={cn(
        "sticky top-20 flex h-fit w-full flex-col gap-6 rounded-lg border bg-background p-6 shadow-sm",
        className
      )}
    >
      <h2 className="text-sm font-semibold">Editor</h2>
      <div className="flex flex-col gap-4">
        {/* Thumbnail */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Thumbnail</Label>
          <ReportThumbnailUploader reportId={reportId} thumbnailUrl={state.thumbnailUrl} onChange={onChange} />
        </div>
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="report-title-sidebar" className="text-xs font-medium">
            Report Title
          </Label>
          <Input
            id="report-title-sidebar"
            value={state.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Report title"
          />
        </div>
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="report-description" className="text-xs font-medium">
            Description
          </Label>
          <Textarea
            id="report-description"
            value={state.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Short description"
            rows={3}
          />
        </div>
        {/* Category */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Category</Label>
          <Select value={state.category} onValueChange={(v) => onChange({ category: v })} disabled={categoriesLoading || noCatData}>
            <SelectTrigger>
              <SelectValue
                placeholder={categoriesLoading ? "Loading..." : noCatData ? "No categories" : "Select category"}
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Interests */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Fields of Interest</Label>
          <InterestsSelector
            options={interestsOptions}
            selected={state.interests}
            onChange={(vals) => onChange({ interests: vals })}
            disabled={interestsLoading || noIntData}
          />
          {interestsLoading && (
            <p className="text-[11px] text-muted-foreground">Loading interests…</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top Header Bar (kept for parity; not currently used in default export)
// ---------------------------------------------------------------------------
interface PageHeaderProps {
  reportId: string;
  reportTitle: string;
  onPublish?: () => void;
  onCompare?: () => void;
  isPublishDisabled?: boolean;
}

function PageHeader({ reportId, reportTitle, onPublish, onCompare, isPublishDisabled }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 max-w-[320px]">
        <Input placeholder="Search Anything" />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="gradient" onClick={onPublish} disabled={isPublishDisabled}>
          Publish
        </Button>
        <Button variant="outline" size="sm" onClick={onCompare} className="gap-2">
          <CopyIcon className="h-4 w-4" />
          Compare report
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fallback Category Options
// ---------------------------------------------------------------------------
const defaultCategories = [
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "politics", label: "Politics" },
];

// Minimal fallback interests (only used if API fails and no prop provided)
const defaultInterests = [
  { value: "students", label: "Students" },
  { value: "teachers", label: "Teachers" },
  { value: "parents", label: "Parents" },
];

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default function ReportDraftPage({
  report,
  contentFormat = "html",
  categories: categoriesProp = defaultCategories,
  interests: interestsProp = defaultInterests,
  onMetaChange,
  onContentChange,
  onPublish,
  onCompareReport,
  onAskAIRequest,
  autosaveDelayMs = 1000,
  showSavingIndicator = true,
  className,
}: ReportDraftPageProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useReportCategory();
  const { data: interestsData, isLoading: interestsLoading } = useReportInterests(); // <-- NEW

  // URL / router helpers
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeReportId = params?.id as string | undefined;

  // -------------------------------------------------------------------------
  // Normalize API payloads -> {value,label}
  // IMPORTANT: value MUST be the backend ID, not the display label.
  // -------------------------------------------------------------------------
  type AnyCat = any;
  const categoryOptions = React.useMemo(() => {
    if (Array.isArray(categoriesData) && categoriesData.length > 0) {
      return (categoriesData as AnyCat[]).map((c) => ({
        value: String(c?.id ?? c?.slug ?? c?.value ?? c?.name ?? "unknown"),
        label: String(c?.name ?? c?.label ?? c?.title ?? c?.id ?? "Unnamed"),
      }));
    }
    return categoriesProp ?? defaultCategories;
  }, [categoriesData, categoriesProp]);

  type AnyInt = any;
  const interestsOptions = React.useMemo(() => {
    if (Array.isArray(interestsData) && interestsData.length > 0) {
      return (interestsData as AnyInt[]).map((i) => ({
        value: String(i?.id ?? i?.slug ?? i?.value ?? i?.name ?? "unknown"),
        label: String(i?.name ?? i?.label ?? i?.title ?? i?.id ?? "Unnamed"),
      }));
    }
    return interestsProp ?? defaultInterests;
  }, [interestsData, interestsProp]);

  // -------------------------------------------------------------------------
  // Safe initial values
  // -------------------------------------------------------------------------
  const safeTitle = report?.title?.trim?.() ?? "";
  const safeDescription = report?.description ?? "";
  const safeCategory = report?.category ?? "";
  const safeInterests = (report?.interests ?? []) as string[]; // may be []
  const safeThumb = report?.thumbnailUrl ?? null;
  const safeBody = report?.body ?? "";
  const reportId = report?.id ?? routeReportId ?? ""; // prefer prop
  const titleFromQuery = searchParams.get("title");

  // -------------------------------------------------------------------------
  // Local form state
  // -------------------------------------------------------------------------
  const [form, setForm] = React.useState<ReportFormState>({
    title: safeTitle,
    description: safeDescription,
    category: safeCategory,
    interests: safeInterests,
    thumbnailUrl: safeThumb,
  });

  const [currentContent, setCurrentContent] = React.useState(safeBody);
  const [saving, setSaving] = React.useState(false);
  const saveTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Publish mutation
  const { mutate: publishReport, isPending: publishing } = usePublishReport();

  // -------------------------------------------------------------------------
  // Validation for Publish button
  // -------------------------------------------------------------------------
  const isPublishDisabled = React.useMemo(() => {
    return (
      !form.title?.trim() ||
      !form.description?.trim() ||
      !form.category ||
      !form.thumbnailUrl ||
      !currentContent?.trim() ||
      form.interests.length === 0 ||
      !reportId // backend requires report_id
    );
  }, [form, currentContent, reportId]);

  // -------------------------------------------------------------------------
  // Autosave helpers
  // -------------------------------------------------------------------------
  const emitMeta = React.useCallback(
    (next: ReportFormState) => {
      if (!onMetaChange) return;
      setSaving(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        onMetaChange(next);
        setSaving(false);
      }, autosaveDelayMs);
    },
    [onMetaChange, autosaveDelayMs]
  );

  const updateForm = (partial: Partial<ReportFormState>) => {
    setForm((prev) => {
      const next = { ...prev, ...partial } as ReportFormState;
      emitMeta(next);
      return next;
    });
  };

  const handleContentChange = React.useCallback(
    (body: string) => {
      setCurrentContent(body);
      if (!onContentChange) return;
      setSaving(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        onContentChange(body);
        setSaving(false);
      }, autosaveDelayMs);
    },
    [onContentChange, autosaveDelayMs]
  );

  // -------------------------------------------------------------------------
  // Publish
  // -------------------------------------------------------------------------
  const handlePublish = async () => {
    if (!reportId) {
      console.error("Cannot publish: missing reportId");
      return;
    }
    const payload: PublishReportPayload = {
      report_id: reportId,
      title: form.title,
      description: form.description,
      categories: [form.category],
      fields_of_interest: form.interests,
      summarized_by: "manual", // TODO wire to real summary method
      content: currentContent,
      thumbnail: form.thumbnailUrl ?? "",
    };

    console.log("[ReportDraftPage] publish payload", payload);

    publishReport(payload, {
      onSuccess: () => {
        if (onPublish) onPublish({ ...form, body: currentContent, reportId });
      },
      onError: (error) => {
        console.error("Failed to publish report:", error);
      },
    });
  };

  // -------------------------------------------------------------------------
  // Compare
  // -------------------------------------------------------------------------
  const handleCompare = () => {
    if (onCompareReport) onCompareReport(reportId);
    else console.log("Compare report", reportId);
  };

  // -------------------------------------------------------------------------
  // Ask AI
  // -------------------------------------------------------------------------
  const handleAskAI = () => {
    if (onAskAIRequest) {
      const current = currentContent;
      const maybe = onAskAIRequest(current);
      if (maybe instanceof Promise) void maybe.then(() => undefined);
    } else {
      console.log("Ask AI clicked");
    }
  };

  // -------------------------------------------------------------------------
  // Breadcrumbs
  // -------------------------------------------------------------------------
  const crumbs: Crumb[] = [
    { label: "Reports", href: "/reports" },
    { label: "My Reports", href: "/reports" },
    { label: "Draft", onClick: () => router.back() },
    {
      label: form.title?.trim() || report?.title || titleFromQuery || "Untitled",
    },
  ];

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 px-4 pb-32 pt-6 md:px-8 lg:px-10 xl:px-16",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Breadcrumbs items={crumbs} />
        <div className="flex items-center gap-2">
          <Button size="sm" variant="gradient" onClick={handlePublish} disabled={isPublishDisabled || publishing}>
            {publishing ? "Publishing…" : "Publish"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCompare} className="gap-2">
            <CopyIcon className="h-4 w-4" />
            Compare report
          </Button>
        </div>
      </div>
      {showSavingIndicator && (
        <div className="text-xs text-muted-foreground h-4" role="status">
          {saving ? "Saving..." : "Saved."}
        </div>
      )}
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
        <div className="relative flex w-full flex-col items-stretch gap-6 overflow-hidden">
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            placeholder="Add a title..."
            className="w-full bg-transparent text-3xl font-semibold tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />
          <ReportRichEditor
            initialContent={safeBody}
            format={contentFormat}
            onChange={handleContentChange}
            askAI={handleAskAI}
            insertImage={() => console.log("Insert image")}
            insertTable={() => console.log("Insert table")}
            insertChart={() => console.log("Insert chart")}
            insertMore={() => console.log("Insert more")}
          />
        </div>
        <EditorPanel
          state={form}
          onChange={updateForm}
          categories={categoryOptions}
          categoriesLoading={categoriesLoading}
          interestsOptions={interestsOptions}
          interestsLoading={interestsLoading}
          reportId={reportId}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
export function ReportDraftPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 pb-20 pt-6 md:px-8 lg:px-10 xl:px-16">
      <div className="flex items-center justify-between gap-4">
        <div className="h-9 w-[320px] animate-pulse rounded-md bg-muted" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
      <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
        <div className="min-h-[60vh] animate-pulse rounded-md bg-muted/50" />
        <div className="hidden h-[480px] animate-pulse rounded-md bg-muted/50 lg:block" />
      </div>
    </div>
  );
}
