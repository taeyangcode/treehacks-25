import React, { ChangeEvent, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { flexRender, getCoreRowModel, useReactTable, ColumnDef, HeaderGroup, Row } from "@tanstack/react-table";
import { Plus, Type, Hash, Calendar } from "lucide-react";

// Each row is a record with string keys and any values.
export interface RowData {
	[key: string]: any;
}

// Create a type alias that adds a "type" property to ColumnDef.
export type CustomColumnDef = ColumnDef<RowData> & {
	type: "str" | "int" | "str";
};

export interface TableProps {
	data: RowData[];
	setData: React.Dispatch<React.SetStateAction<RowData[]>>;
	columns: CustomColumnDef[];
	setColumns: React.Dispatch<React.SetStateAction<CustomColumnDef[]>>;
}

interface TableHeaderProps {
	headerGroups: HeaderGroup<RowData>[];
	onEditHeader: (columnIndex: number, newHeader: string) => void;
	onEditColumnType: (columnIndex: number, newType: "str" | "int" | "str") => void;
}

interface AnimatedIconProps {
	currentType: "str" | "int" | "str";
	onChange: (newType: "str" | "int" | "str") => void;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ currentType, onChange }) => {
	const [displayType, setDisplayType] = useState(currentType);

	// Cycle through the types.
	const getNextType = (type: "str" | "int" | "str"): "str" | "int" | "str" =>
		type === "str" ? "int" : type === "int" ? "str" : "str";

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		const nextType = getNextType(displayType);
		// Delay updating to allow the exit animation to play.
		setTimeout(() => {
			setDisplayType(nextType);
			onChange(nextType);
		}, 300);
	};

	// Select the appropriate icon.
	let icon = null;
	if (displayType === "str") {
		icon = <Type size={20} className="stroke-gray-300" />;
	} else if (displayType === "int") {
		icon = <Hash size={20} className="stroke-gray-300" />;
	} else if (displayType === "str") {
		icon = <Calendar size={20} className="stroke-gray-300" />;
	}

	return (
		<AnimatePresence mode="wait">
			<motion.span
				key={displayType}
				initial={{ x: 30, opacity: 0 }} // Slight offset from the right
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: -30, opacity: 0 }} // Exits slightly to the left
				transition={{ duration: 0.2 }}
				onClick={handleClick}
				style={{ display: "inline-block", cursor: "pointer" }}
			>
				{icon}
			</motion.span>
		</AnimatePresence>
	);
};

function TableHeader({ headerGroups, onEditHeader, onEditColumnType }: TableHeaderProps) {
	// Local state for handling dropdown visibility per header.
	const [openColumn, setOpenColumn] = useState<number | null>(null);

	return (
		<thead className="bg-[#1f1f1f]">
			{headerGroups.map((headerGroup) => (
				<tr key={headerGroup.id}>
					{headerGroup.headers.map((header, columnIndex) => {
						const columnDef = header.column.columnDef as CustomColumnDef;
						return (
							<th
								key={header.id}
								// Clicking the header toggles the dropdown.
								onClick={() => setOpenColumn(openColumn === columnIndex ? null : columnIndex)}
								className={`relative ${
									columnIndex < headerGroup.headers.length - 1 ? "border-r-2" : ""
								} border-[#363636] p-2 transition-colors duration-200 hover:bg-[#2a2a2a]`}
							>
								<div className="flex items-center justify-center gap-x-2">
									{/* Use AnimatedIcon for the sliding transition */}
									<AnimatedIcon
										currentType={columnDef.type}
										onChange={(newType) => onEditColumnType(columnIndex, newType)}
									/>
									<input
										value={columnDef.header as string}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											onEditHeader(columnIndex, e.target.value)
										}
										// Prevent input click from toggling the dropdown.
										onClick={(e) => e.stopPropagation()}
										className="w-fit rounded-lg border-none bg-transparent text-center font-manrope text-lg font-bold text-white/80 outline-none"
									/>
								</div>
								{/* Dropdown for selecting the type (optional) */}
								{openColumn === columnIndex && (
									<div className="absolute left-0 top-full mt-1 flex w-full flex-row justify-around gap-x-2 rounded bg-gray-800 p-1 text-white">
										<button
											onClick={(e) => {
												e.stopPropagation();
												onEditColumnType(columnIndex, "str");
											}}
											className="flex items-center gap-x-1 rounded p-1 transition-colors duration-200 hover:bg-[#2a2a2a]"
										>
											<Type size={16} />
											<span className="text-sm">str</span>
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												onEditColumnType(columnIndex, "int");
											}}
											className="flex items-center gap-x-1 rounded p-1 transition-colors duration-200 hover:bg-[#2a2a2a]"
										>
											<Hash size={16} />
											<span className="text-sm">int</span>
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												onEditColumnType(columnIndex, "str");
											}}
											className="flex items-center gap-x-1 rounded p-1 transition-colors duration-200 hover:bg-[#2a2a2a]"
										>
											<Calendar size={16} />
											<span className="text-sm">str</span>
										</button>
									</div>
								)}
							</th>
						);
					})}
				</tr>
			))}
		</thead>
	);
}

interface TableBodyProps {
	rows: Row<RowData>[];
}

// Renders the table body rows and cells.
function TableBody({ rows }: TableBodyProps) {
	return (
		<tbody>
			{rows.map((row) => (
				<tr key={row.id}>
					{row.getVisibleCells().map((cell, cellIndex) => (
						<td
							key={cell.id}
							className={`border-t-2 border-[#363636] bg-[#171717] p-2 outline-none ${
								cellIndex !== row.getVisibleCells().length - 1 ? "border-r-2 border-[#363636]" : ""
							}`}
						>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</td>
					))}
				</tr>
			))}
		</tbody>
	);
}

export default function Table({ data, setData, columns, setColumns }: TableProps) {
	// Create the table instance using tanstack/react-table.
	const table = useReactTable<RowData>({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Upstr a cell's value.
	function handleEdit(rowIndex: number, columnId: string, value: any): void {
		setData((prev) => prev.map((row, idx) => (idx === rowIndex ? { ...row, [columnId]: value } : row)));
	}

	// Upstr a column's header (name).
	function handleEditHeader(columnIndex: number, newHeader: string): void {
		setColumns((prev) => prev.map((col, idx) => (idx === columnIndex ? { ...col, header: newHeader } : col)));
	}

	// Upstr a column's data type.
	function handleEditColumnType(columnIndex: number, newType: "str" | "int" | "str"): void {
		setColumns((prev) => prev.map((col, idx) => (idx === columnIndex ? { ...col, type: newType } : col)));
	}

	// Add a new column with a default type of "str".
	function addColumn(): void {
		const newColumn: CustomColumnDef = {
			accessorKey: `col-${columns.length}`,
			header: `Column ${columns.length + 1}`,
			type: "str",
			cell: ({ row, column }) => (
				<input
					value={row.getValue(column.id) || ""}
					onChange={(e: ChangeEvent<HTMLInputElement>) => handleEdit(row.index, column.id, e.target.value)}
					className="w-full bg-transparent p-1 text-lg text-white/80 outline-none"
				/>
			),
		};
		setColumns([...columns, newColumn]);
	}

	return (
		<div className="flex flex-row justify-center gap-x-1">
			{/* Container now has a max height of 500px and vertical scrolling */}
			<div className="max-h-[500px] overflow-y-auto rounded-lg border-2 border-[#363636]">
				<table className="w-full border-collapse rounded-lg border-none">
					<TableHeader
						headerGroups={table.getHeaderGroups()}
						onEditHeader={handleEditHeader}
						onEditColumnType={handleEditColumnType}
					/>
					<TableBody rows={table.getRowModel().rows} />
				</table>
			</div>
			<button
				className="grid h-full w-6 place-content-center rounded-md bg-[#1f1f1f]/80 transition duration-200 hover:bg-[#1f1f1f]"
				onClick={addColumn}
			>
				<Plus size={20} className="stroke-white/60 transition duration-100 hover:stroke-white/80" />
			</button>
		</div>
	);
}
