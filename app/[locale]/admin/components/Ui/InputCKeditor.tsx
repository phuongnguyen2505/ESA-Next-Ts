import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";
import MyUploadAdapter from "@/pages/api/myUploadAdapter";

const LICENSE_KEY =
	"eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjkwMzk5OTksImp0aSI6IjcyMmU5ZjIxLTIxYjEtNGM5MS1hY2I4LWRiNmNmOTViMWMzNSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCJdLCJ2YyI6IjQyNjVkMmExIn0.UY5guHVpgWOGrzKxfSnS6Qd0flEUAuDZwW0PaLiQStxgPAdFl8xnOxoptUzv80BkJk8o6lM8Uh-BnFXk-jRfhA"; // Replace with your license key

interface RichTextEditorProps {
	value: string;
	onChange: (data: string) => void;
	title: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
	value,
	onChange,
	title,
}) => {
	const editorContainerRef = useRef<HTMLDivElement | null>(null);
	const editorRef = useRef<HTMLDivElement | null>(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const mountedRef = useRef(false); // Track component mount status
	const cloud = useCKEditorCloud({ version: "44.1.0" });

	useEffect(() => {
		mountedRef.current = true;
		setIsLayoutReady(true);

		return () => {
			mountedRef.current = false;
			setIsLayoutReady(false);
		};
	}, []);

	function uploadPlugin(editor: any) {
		editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
			return new MyUploadAdapter(loader);
		};
	}

	const { ClassicEditor, editorConfig } = useMemo(() => {
		if (cloud.status !== "success" || !isLayoutReady) {
			return { ClassicEditor: null, editorConfig: {} };
		}

		const {
			ClassicEditor,
			Autoformat,
			AutoImage,
			Autosave,
			BalloonToolbar,
			BlockQuote,
			Bold,
			Code,
			Essentials,
			FindAndReplace,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			FullPage,
			GeneralHtmlSupport,
			Heading,
			Highlight,
			HtmlEmbed,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsert,
			ImageResize,
			ImageStyle,
			ImageToolbar,
			ImageUpload,
			Indent,
			Italic,
			Link,
			List,
			MediaEmbed,
			Mention,
			PageBreak,
			Paragraph,
			RemoveFormat,
			SimpleUploadAdapter,
			SourceEditing,
			SpecialCharacters,
			Strikethrough,
			Table,
			TableToolbar,
			Underline,
		} = cloud.CKEditor;

		return {
			ClassicEditor,
			editorConfig: {
				toolbar: {
					items: [
						"sourceEditing",
						"showBlocks",
						"findAndReplace",
						"|",
						"heading",
						"|",
						"fontSize",
						"fontFamily",
						"fontColor",
						"fontBackgroundColor",
						"|",
						"bold",
						"italic",
						"underline",
						"strikethrough",
						"code",
						"removeFormat",
						"|",
						"link",
						"insertImage",
						"mediaEmbed",
						"insertTable",
						"blockQuote",
						"|",
						"bulletedList",
						"numberedList",
						"outdent",
						"indent",
					],
					shouldNotGroupWhenFull: false,
				},
				plugins: [
					Autoformat,
					AutoImage,
					Autosave,
					BalloonToolbar,
					BlockQuote,
					Bold,
					Code,
					Essentials,
					FindAndReplace,
					FontBackgroundColor,
					FontColor,
					FontFamily,
					FontSize,
					FullPage,
					GeneralHtmlSupport,
					Heading,
					Highlight,
					HtmlEmbed,
					ImageBlock,
					ImageCaption,
					ImageInline,
					ImageInsert,
					ImageResize,
					ImageStyle,
					ImageToolbar,
					ImageUpload,
					Indent,
					Italic,
					Link,
					List,
					MediaEmbed,
					Mention,
					PageBreak,
					Paragraph,
					RemoveFormat,
					SimpleUploadAdapter,
					SourceEditing,
					SpecialCharacters,
					Strikethrough,
					Table,
					TableToolbar,
					Underline,
				],
				licenseKey: LICENSE_KEY,
				image: {
					toolbar: [
						"toggleImageCaption",
						"imageTextAlternative",
						"|",
						"imageStyle:inline",
						"imageStyle:wrapText",
						"imageStyle:breakText",
						"|",
						"resizeImage",
					],
				},
				extraPlugins: [uploadPlugin],
			},
		};
	}, [cloud, isLayoutReady]);

	return (
		<div className="main-container">
			<div className="editor-container" ref={editorContainerRef}>
				<label className="block text-sm font-medium mb-1">
					{title}
				</label>
				<div className="editor-container__editor text-black" ref={editorRef}>
					{ClassicEditor && editorConfig ? (
						<CKEditor
							editor={ClassicEditor}
							data={value || ""}
							config={editorConfig}
							onChange={(event, editor) => {
								const data = editor.getData();
								onChange(data);
							}}
						/>
					) : (
						<p className="text-gray-500">Loading editor...</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default RichTextEditor;
