import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface InputCKeditorProps {
	title: string;
	value: string;
	onChange: (data: string) => void;
	language?: string;
	editorConfig?: any;
}

const InputCKeditor = ({
	title,
	value,
	onChange,
	language,
	editorConfig,
}: InputCKeditorProps) => {
	return (
		<div>
			<label className="block text-sm font-medium mb-1">
				{title} {language && `(${language})`}
			</label>
			<div className="border border-gray-300 rounded-md dark:text-[#333333]">
				<CKEditor
					editor={ClassicEditor}
					data={value || ""}
					config={editorConfig}
					onChange={(event, editor) => {
						const data = editor.getData();
						onChange(data);
					}}
				/>
			</div>
		</div>
	);
};

export default InputCKeditor;
