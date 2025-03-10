import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Image from "@editorjs/image";
import LinkTool from "@editorjs/link";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";

export const EDITOR_JS_TOOLS = {
	header: {
		class: Header,
		config: {
			levels: [1, 2, 3, 4, 5, 6],
			defaultLevel: 2,
		},
	},
	list: {
		class: List,
		inlineToolbar: true,
	},
	checklist: {
		class: Checklist,
		inlineToolbar: true,
	},
	quote: {
		class: Quote,
		inlineToolbar: true,
	},
	image: {
		class: Image,
		config: {
			endpoints: {
				byFile: "/api/uploadImage",
			},
			additionalRequestData: {
				folder: "editor",
			},
		},
	},
	linkTool: {
		class: LinkTool,
		config: {
			endpoint: "/api/fetchUrl",
		},
	},
	table: {
		class: Table,
		inlineToolbar: true,
	},
	marker: Marker,
	inlineCode: InlineCode,
	underline: Underline,
};
