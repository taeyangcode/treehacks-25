"use client";

import React, { useEffect, useState } from "react";
import Table, { CustomColumnDef, RowData } from "@/components/Table/Table";
import Textarea from "@/components/Textarea/Textarea";

export default function Create() {
	const [prompt, setPrompt] = useState("");
	const [rowData, setRowData] = useState<RowData[]>([]);
	const [columns, setColumns] = useState<CustomColumnDef[]>([
		{
			accessorKey: "col-0",
			header: "Column 1",
			type: "str",
			cell: ({ row, column }) => (
				<input
					value={row.getValue(column.id) || ""}
					onChange={() =>
						// Handle cell edit if needed
						null
					}
					className="w-full bg-transparent p-1 text-lg text-white/80 outline-none"
				/>
			),
		},
	]);

	useEffect(() => {
		console.log({ rowData, columns });
	}, [rowData, columns]);

	async function fetchData() {
		const url = "http://127.0.0.1:5000/api/scrape/start";

		// Use the prompt from state.
		const promptText = prompt;
		// Derive the schema from the columns state: header as key, and type as value.
		const schema = columns.reduce(
			(acc, column) => {
				if (column.header && column.type) {
					acc[column.header] = column.type;
				}
				return acc;
			},
			{} as { [key: string]: string },
		);

		console.log(promptText, schema);

		const row_limit = 10;

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt: promptText, schema, row_limit }),
		};

		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (!response.body) {
				console.error("ReadableStream not supported in this browser.");
				return;
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let done = false;

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				if (value) {
					const chunkText = decoder.decode(value, { stream: true });
					try {
						// Each chunk is a complete JSON response.
						const jsonChunk = JSON.parse(chunkText);
						console.log("Received JSON chunk:", jsonChunk);
						if (jsonChunk.row_list && Array.isArray(jsonChunk.row_list)) {
							// Transform each row: extract the value for each column based on the column header.
							// const newRows = jsonChunk.row_list.map((row: any) => {
							// 	const newRow: { [key: string]: any } = {};
							// 	columns.forEach((column) => {
							// 		const accessor = column.accessorKey;
							// 		const header = column.header as string;
							// 		// Extract the value for this column from the nested object.
							// 		newRow[accessor] =
							// 			row[accessor] && row[accessor][header] !== undefined
							// 				? row[accessor][header]
							// 				: "";
							// 	});
							// 	return newRow;
							// });
							// // Append the newly transformed rows.
							// setRowData((prevData) => [...prevData, ...newRows]);
							jsonChunk.row_list.forEach((rowContent) => {
								// Build a new row object
								const newRow: { [key: string]: any } = {};
								columns.forEach((column, index) => {
									const header = column.header as string;
									newRow[`col-${index}`] = rowContent[header];
								});
								// Append the built row to rowData
								setRowData((previous) => [...previous, newRow]);
							});
						}
					} catch (error) {
						console.error("Error parsing JSON chunk:", error, chunkText);
					}
				}
			}

			// Process any remaining text after the stream ends.
			const remainingText = decoder.decode();
			if (remainingText) {
				try {
					const jsonChunk = JSON.parse(remainingText);
					if (jsonChunk.row_list && Array.isArray(jsonChunk.row_list)) {
						const newRows = jsonChunk.row_list.map((row: any) => {
							const newRow: { [key: string]: any } = {};
							columns.forEach((column) => {
								const accessor = column.accessorKey;
								const header = column.header as string;
								newRow[accessor] =
									row[accessor] && row[accessor][header] !== undefined ? row[accessor][header] : "";
							});
							return newRow;
						});
						setRowData((prevData) => [...prevData, ...newRows]);
					}
				} catch (error) {
					console.error("Error parsing final JSON chunk:", error, remainingText);
				}
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	return (
		<div className="flex h-full w-full flex-row justify-center">
			<div className="relative flex h-full w-4/5 flex-col items-center justify-center">
				<div className="flex h-fit w-full flex-col items-center justify-center gap-y-10">
					<span className="w-full text-center font-manrope text-5xl font-semibold text-white/90">
						Let Odin build <b>your</b> dataset
					</span>
					<Table data={rowData} setData={setRowData} columns={columns} setColumns={setColumns} />
				</div>

				<div className="absolute bottom-0 flex h-fit w-full justify-center pb-10">
					<Textarea
						value={prompt}
						onChange={setPrompt}
						placeholder="Describe your data..."
						inputDisabled={false}
						submitDisabled={prompt.length === 0}
						onSubmit={fetchData}
					/>
				</div>
			</div>
		</div>
	);
}
