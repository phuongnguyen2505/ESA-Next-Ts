class MyUploadAdapter {
	private loader;

	constructor(loader: any) {
		this.loader = loader;
	}

	upload() {
		return this.loader.file.then((file: File) => {
			const formData = new FormData();
			formData.append("upload", file);

			return fetch("/api/uploadImage", {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((response) => {
					return {
						default: response.url,
					};
				});
		});
	}

	abort() {
		// Abort upload implementation
	}
}

export default MyUploadAdapter;
