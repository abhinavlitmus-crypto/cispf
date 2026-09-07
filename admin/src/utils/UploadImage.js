/* eslint-disable react-hooks/exhaustive-deps */
import { UploadOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, message, Space, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useFileDeleteMutation, useFileSaveMutation } from "../query/file.query";
import util from "./util";
const DraggableUploadListItem = ({ originNode, file }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: file.uid,
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: "move",
	};
	return (
		<div
			ref={setNodeRef}
			style={style}
			// prevent preview event when drag end
			className={isDragging ? "is-dragging" : ""}
			{...attributes}
			{...listeners}
		>
			{/* hide error tooltip when dragging */}
			{file.status === "error" && isDragging
				? originNode.props.children
				: originNode}
		</div>
	);
};
export default function UploadImage({
	value = [],
	accept = "image/*,application/pdf",
	uploadButton = (
		<Space align="center">
			<Space.Compact align="center" direction="vertical">
				<Button
					type="text"
					style={{ margin: "auto" }}
					icon={<UploadOutlined />}
				></Button>
				<Button type="text">Upload</Button>
			</Space.Compact>
		</Space>
	),
	count = 1,
	cropImage = null,
	disabled = false,
	classs,
	onChange,
	...others
}) {
	const [fileList, setFileList] = useState([...util.getFileFormat(value)]);
	let allFiles = [...util.getFileFormat(value)];
	const fileSaveMutation = useFileSaveMutation();
	const fileRemoveMutation = useFileDeleteMutation();
	useEffect(() => {
		setFileList([...util.getFileFormat(value)]);
		allFiles = [...util.getFileFormat(value)];
	}, [value]);

	const customRequest = async (options) => {
		const { onSuccess, onError, file, onProgress } = options;

		const fmData = new FormData();
		const config = {
			onUploadProgress: (event) => {
				onProgress({ percent: (event.loaded / event.total) * 100 });
			},
		};
		fmData.append("file", file);
		try {
			fileSaveMutation.mutate(fmData, {
				onSuccess: (res) => {
					onSuccess("Ok");
					console.log(res, "RE")

					allFiles = [
						...allFiles,
						{
							uid: res.data.uid,
							url: res.data.url,
							name: res.data.name,
							percent: 33,
						},
					];
					// setFileList([...fileList, { uid: res.data.uid, url: res.data.url, name: res.data.name, percent: 33, }]);
					if (onChange && typeof onChange == "function") {
						onChange([...allFiles?.map((v) => v.url)]);
					}
				},
				onError: (err) => {
					onError({ err });
				}
			})

		} catch (err) {
			onError({ err });
		}
	};


	const handleRemove = (file) => {
		setFileList((prevList) => {
			const newList = prevList.filter((v) => v.uid !== file.uid);

			if (onChange && typeof onChange === "function") {
				onChange(newList.map((v) => v.url));
			}

			return newList;
		});

		return false;
	};



	const onDragEnd = ({ active, over }) => {
		if (active.id !== over?.id) {
			setFileList((prev) => {
				const activeIndex = prev.findIndex((i) => i.uid === active.id);
				const overIndex = prev.findIndex((i) => i.uid === over?.id);
				onChange([
					...arrayMove(prev, activeIndex, overIndex)?.map(
						(v) => v.url,
					),
				]);
				return arrayMove(prev, activeIndex, overIndex);
			});
		}
	};
	const handleOnChange = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};
	const sensor = useSensor(PointerSensor, {
		activationConstraint: {
			distance: 10,
		},
	});
	if (cropImage) {
		if (typeof cropImage !== typeof {}) {
			cropImage = {};
		}
		cropImage.aspect = cropImage.aspect || 1;
		cropImage.shape = cropImage.shape || "rect";
		cropImage.quality = cropImage.quality || 1;
		return (
			<></>
		);
	}

	else {
		return (
			<DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
				<SortableContext
					items={fileList.map((i) => i.uid)}
					strategy={verticalListSortingStrategy}
				>
					<Upload
						// accept="image/*,application/pdf"
						accept={accept}
						disabled={disabled}
						customRequest={customRequest}
						onChange={handleOnChange}
						onRemove={handleRemove}
						fileList={fileList}
						multiple={true}
						className={classs}
						itemRender={(originNode, file) => (
							<DraggableUploadListItem
								originNode={originNode}
								file={file}
							/>
						)}
						{...{ ...others }}
					>
						{fileList?.length >= count ? null : uploadButton}
					</Upload>
				</SortableContext>
			</DndContext>
		);
	}
}
