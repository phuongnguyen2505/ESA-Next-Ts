import MyUploadAdapter from "@/pages/api/myUploadAdapter";

function uploadPlugin(editor: any) {
	editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
		return new MyUploadAdapter(loader);
	};
}

export const editorConfig = {
	toolbar: [
		"heading",
		"|",
		"bold",
		"italic",
		"link",
		"bulletedList",
		"numberedList",
		"|",
		"imageUpload",
		"blockQuote",
		"insertTable",
		"mediaEmbed",
		"undo",
		"redo",
	],
	extraPlugins: [uploadPlugin],
};
