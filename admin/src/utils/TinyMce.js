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

// TinyMCE 6 is self-hosted from public/tinymce (core + themes, skins, icons, plugins).
export default function App({ value = "", onChange, disable = false, editorHeight }) {
	const editorRef = useRef(null);
	const fileMutation = useFileSaveMutation();

	return (
		<>
			<Editor
				disabled={disable}
				tinymceScriptSrc={`${process.env.PUBLIC_URL}/tinymce/tinymce.min.js`}
				onInit={(evt, editor) => (editorRef.current = editor)}
				// Controlled: passing value back as initialValue would reset content (and cursor) on every keystroke
				value={value}
				init={{
					height: editorHeight || 600,
					promotion: false,
					branding: false,
					plugins:
						"preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help quickbars emoticons",
					menubar: "file edit view insert format tools table help",
					toolbar:
						"undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview | image media template link anchor codesample | ltr rtl | code",
					toolbar_mode: "sliding",
					autosave_ask_before_unload: true,
					autosave_interval: "30s",
					autosave_prefix: "{path}{query}-{id}-",
					autosave_restore_when_empty: false,
					autosave_retention: "2m",
					image_advtab: true,
					image_caption: true,
					importcss_append: true,
					templates: [
						{
							title: "New Table",
							description: "creates a new table",
							content:
								'<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
						},
					],
					quickbars_selection_toolbar:
						"bold italic | quicklink h2 h3 blockquote quickimage quicktable",
					contextmenu: "link image table",
					font_family_formats:
						"Montserrat=Montserrat; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
					content_style:
						"@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap'); body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }",
					file_picker_types: "image",
					file_picker_callback: function (cb, value, meta) {
						const input = document.createElement("input");
						input.setAttribute("type", "file");
						input.setAttribute("accept", "image/*");
						input.onchange = function () {
							const file = this.files[0];
							const fmData = new FormData();
							fmData.append("file", file);
							fileMutation.mutate(fmData, {
								onSuccess: (res) => {
									cb(res.data.url, { title: res.data.name });
								},
							});
						};
						input.click();
					},
				}}
				onEditorChange={(content) => onChange?.(content)}
			/>
		</>
	);
}
