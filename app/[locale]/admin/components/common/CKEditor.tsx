import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorProps {
	value: string;
	onChange: (content: string) => void;
}

export default function CustomCKEditor({ value, onChange }: CKEditorProps) {
	return (
		<CKEditor
			editor={ClassicEditor}
			data={value}
			onChange={(event, editor) => {
				const data = editor.getData();
				onChange(data);
			}}
		/>
	);
}
