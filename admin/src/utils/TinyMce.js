// import React from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { useFileSaveMutation } from "../query/file.query";

// export default function App({ value = "", onChange, disable = false, editorHeight }) {
//   const fileMutation = useFileSaveMutation();

//   // Custom image upload
//   class UploadAdapter {
//     constructor(loader) {
//       this.loader = loader;
//     }

//     upload() {
//       return this.loader.file.then(
//         (file) =>
//           new Promise((resolve, reject) => {
//             const formData = new FormData();
//             formData.append("file", file);

//             fileMutation.mutate(formData, {
//               onSuccess: (res) => resolve({ default: res?.data?.url }),
//               onError: (err) => reject(err),
//             });
//           })
//       );
//     }

//     abort() {}
//   }

//   const uploadPlugin = (editor) => {
//     editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new UploadAdapter(loader);
//   };

//   return (
//     <div className="w-full">
//       <CKEditor
//         editor={ClassicEditor}
//         data={value}
//         disabled={disable}
//         config={{
//           extraPlugins: [uploadPlugin],
//           toolbar: [
//             "undo",
//             "redo",
//             "|",
//             "bold",
//             "italic",
//             "underline",
//             "link",
//             "|",
//             "bulletedList",
//             "numberedList",
//             "|",
//             "blockQuote",
//             "insertTable",
//             "imageUpload",
//             "mediaEmbed",
//           ],
//         }}
//         onChange={(event, editor) => onChange(editor.getData())}
//       />

//       <style jsx>{`
//         .ck-editor__editable_inline {
//           min-height: ${editorHeight || 500}px;
//         }
//       `}</style>
//     </div>
//   );
// }




import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";
import { useFileSaveMutation } from "../query/file.query";

export default function App({ value = "", onChange, disable = false , editorHeight, }) {
	const editorRef = useRef(null);
	const fileMutation = useFileSaveMutation()

	return (
		<>
			<Editor
				disabled={disable}
				tinymceScriptSrc={"/tinymce.min.js"}
				onInit={(evt, editor) => (editorRef.current = editor)}
				initialValue={value}
				init={{
					height: 500,
					menubar: false,
					plugins: [
						"advlist",
						"autolink",
						"lists",
						"link",
						"image",
						"charmap",
						"anchor",
						"searchreplace",
						"visualblocks",
						"code",
						"fullscreen",
						"insertdatetime",
						"media",
						"table",
						"preview",
						"help",
						"wordcount",
					],
					toolbar:
						"undo redo | blocks | " +
						"bold italic forecolor | alignleft aligncenter " +
						"alignright alignjustify | bullist numlist outdent indent | " +
						"removeformat | help",
					content_style:
						"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
					ai_request: (request, respondWith) =>
						respondWith.string(() =>
							Promise.reject(
								"See docs to implement AI Assistant",
							),
						),
					plugins:
						"toc print preview importcss tinydrive searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars linkchecker emoticons",
					menubar: "file edit view insert format tools table tc help",
					toolbar:
						"undo redo | toc | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor casechange removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl | showcomments addcomment",
					autosave_ask_before_unload: true,
					autosave_interval: "30s",
					autosave_prefix: "{path}{query}-{id}-",
					autosave_restore_when_empty: false,
					autosave_retention: "2m",
					image_advtab: true,
					link_list: [
						{ title: "My page 1", value: "https://www.tiny.cloud" },
						{
							title: "My page 2",
							value: "http://www.moxiecode.com",
						},
					],
					image_list: [
						{ title: "My page 1", value: "https://www.tiny.cloud" },
						{
							title: "My page 2",
							value: "http://www.moxiecode.com",
						},
					],
					image_class_list: [
						{ title: "None", value: "" },
						{ title: "Some class", value: "class-name" },
					],
					importcss_append: true,
					templates: [
						{
							title: "New Table",
							description: "creates a new table",
							content:
								'<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
						},
						{
							title: "Starting my story",
							description: "A cure for writers block",
							content: "Once upon a time...",
						},
						{
							title: "New list with dates",
							description: "New List with dates",
							content:
								'<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
						},
					],
					template_cdate_format:
						"[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
					template_mdate_format:
						"[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
					height: `${editorHeight ? editorHeight :600}`,
					image_caption: true,
					quickbars_selection_toolbar:
						"bold italic | quicklink h2 h3 blockquote quickimage quicktable",
					noneditable_noneditable_class: "mceNonEditable",
					toolbar_mode: "sliding",
					content_style: ".mymention{ color: gray; }",
					contextmenu:
						"link image imagetools table configurepermanentpen",
					font_formats:
						"Montserrat=Montserrat; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
					content_style: [
						"@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');",
					],
					file_picker_callback: function (cb, value, meta) {
						const input = document.createElement("input");
						input.setAttribute("type", "file");
						input.setAttribute("accept", "image/*");
						input.onchange = function () {
							const file = this.files[0];
							const fmData = new FormData();
							fmData.append("file", file);
							try {
								fileMutation.mutate(fmData, {
									onSuccess: (res) => {
										cb(res.data.url, { title: res.data.name });
									},
									onError: (err) => {

									}
								})
							} catch (err) { }
						};
						input.click();
					},
				}}
				onSelectionChange={() => {
					if (editorRef.current) {
						onChange(editorRef.current.getContent());
					}
				}}

			/>
		</>
	);
}
