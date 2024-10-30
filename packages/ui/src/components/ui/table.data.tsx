import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import {
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	type Row,
	type RowData,
	type SortingState,
	type Table as TSTable,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CaretSortIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	Cross2Icon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
	EyeNoneIcon,
	MixerHorizontalIcon,
	PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Fragment, type ReactNode, useEffect, useState } from "react";
import { cn } from "../../utils/dom";
import { Badge } from "./badge";
import { Button } from "./button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "./command";
import {
	Dropdown,
	DropdownCheckboxItem,
	DropdownContent,
	DropdownItem,
	DropdownLabel,
	DropdownSeparator,
	DropdownTrigger,
} from "./dropdown";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";
import { Separator } from "./separator";

export interface FacetedFilterOption {
	label: string;
	value: string;
	icon?: React.ComponentType<{ className?: string }>;
}
interface FacetedFilterProps {
	title?: string;
	options: FacetedFilterOption[];
}

export type ExpandedData<TData> = {
	data: TData;
};

declare module "@tanstack/react-table" {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

export type EditableDataConfig<TData> = Partial<{
	editableColumnIds: (keyof TData | string)[];
}>;

const EditableColumn = <TData,>({
	editableColumnIds: ids = [],
}: EditableDataConfig<TData>): Partial<ColumnDef<TData>> => ({
	cell: ({ getValue, row: { index }, column: { id }, table }) => {
		if (!ids.includes(id)) return getValue();

		const initialValue = getValue();
		// We need to keep and update the state of the cell normally
		const [value, setValue] = useState(initialValue);

		// When the input is blurred, we'll call our table meta's updateData function
		const onBlur = () => {
			table.options.meta?.updateData(index, id, value);
		};

		// If the initialValue is changed external, sync it up with our state
		useEffect(() => {
			setValue(initialValue);
		}, [initialValue]);

		return (
			<input
				value={value as string}
				onChange={(e) => setValue(e.target.value)}
				onBlur={onBlur}
				className="bg-muted rounded-md"
			/>
		);
	},
});

export type ExpandedDataConfig<TData> = Partial<{
	getRowCanExpand: (row: Row<TData>) => boolean;
	expandedData: (props: ExpandedData<TData>) => ReactNode;
}>;

export type DataTableConfig<TData> = Partial<
	{
		title: string | ReactNode;
		visibility: boolean;
		paginate: boolean;
		loading: boolean;

		search: string | keyof TData;
		filters: Partial<Record<keyof TData, FacetedFilterProps>>;
		sort: SortingState;

		onRowClick: (row: TData) => void;
	} & ExpandedDataConfig<TData> &
		EditableDataConfig<TData>
>;

export interface DataTable<TData, TValue> extends DataTableConfig<TData> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export type DataTableProps<TData, TValue> = DataTable<TData, TValue> &
	DataTableConfig<TData>;

export function DataTable<TData, TValue>({
	// BASE
	data,
	columns,

	// CONFIG
	title,
	visibility = true,
	paginate = true,
	loading = false,
	search,
	filters = {},
	sort = [],
	onRowClick,

	// EDITABLE
	editableColumnIds = [],

	// EXPANDED
	getRowCanExpand,
	expandedData: ExpandedData,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>(sort);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [expanded, setExpanded] = useState({});

	const table = useReactTable({
		data,
		columns,
		defaultColumn: EditableColumn<TData>({ editableColumnIds }),

		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,

		getRowCanExpand,
		getExpandedRowModel: getExpandedRowModel(),
		onExpandedChange: setExpanded,

		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			expanded,
		},
	});

	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<section className="flex flex-col gap-2">
			<header className="flex flex-col gap-1">
				<div
					className={cn(
						"flex flex-col gap-y-2",
						"sm:flex-row flex-wrap gap-x-2 sm:place-items-center place-content-between",
						// "flex flex-wrap flex-row place-items-center place-content-between gap-x-6 gap-y-2",
					)}
				>
					{!!title &&
						(typeof title === "string" ? (
							<p className={cn("h2 text-xl")}>{title}</p>
						) : (
							title
						))}

					{!!search && (
						<div
							className={cn(
								"w-full flex-1",
								"flex flex-row place-items-center gap-x-2 gap-y-1",
							)}
						>
							<Input
								name="data-table-search"
								placeholder={`Search ${search.toString().replace("_", " ")}...`}
								value={
									(table
										.getColumn(search.toString())
										?.getFilterValue() as string) ?? ""
								}
								onChange={(event) =>
									table
										.getColumn(search.toString())
										?.setFilterValue(event.target.value)
								}
								className={cn(
									"truncate min-w-20 max-w-prose bg-background basis-1/3",
									"flex-1",
								)}
							/>
							{isFiltered && (
								<Button
									variant="ghost"
									onClick={() => table.resetColumnFilters()}
									className="space-x-2 p-1"
								>
									<span>Reset</span>
									<Cross2Icon className="size-4" />
								</Button>
							)}
						</div>
					)}

					{Object.entries(filters).map(([filter, props]) => {
						const column = table.getColumn(filter.toString());
						if (!column) return null;
						return (
							<DataTableFacetedFilter
								key={`table-filter-${filter}`}
								column={column}
								{...(props as FacetedFilterProps)}
							/>
						);
					})}

					{visibility && <DataTable.ViewOptions table={table} />}
				</div>
			</header>

			<main className="rounded-md border bg-background">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<Fragment key={row.id}>
									<TableRow
										data-state={row.getIsSelected() && "selected"}
										onClick={() => onRowClick?.(row.original)}
										className={cn(onRowClick && "cursor-pointer")}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}

										{!!ExpandedData && (
											<TableCell>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
													onClick={row.getToggleExpandedHandler()}
												>
													{row.getIsExpanded() ? (
														<ChevronUpIcon />
													) : (
														<ChevronDownIcon />
													)}
												</Button>
											</TableCell>
										)}
									</TableRow>

									{!!ExpandedData && row.getIsExpanded() && (
										<TableRow className="bg-muted/50">
											<TableCell colSpan={columns.length + 1}>
												<ExpandedData data={row.original} />
											</TableCell>
										</TableRow>
									)}
								</Fragment>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center space-x-2"
								>
									{loading ? "Loading . . ." : "No results."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</main>

			{paginate && <DataTable.Pagination table={table} />}
		</section>
	);
}
export default DataTable;

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<Dropdown>
				<DropdownTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className=" h-8 data-[state=open]:bg-accent space-x-2"
					>
						<span>{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ArrowDownIcon className="size-4" />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUpIcon className="size-4" />
						) : (
							<CaretSortIcon className="size-4" />
						)}
					</Button>
				</DropdownTrigger>
				<DropdownContent align="start">
					<DropdownItem onClick={() => column.toggleSorting(false)}>
						<ArrowUpIcon className="size-3.5 text-muted-foreground/70" />
						Asc
					</DropdownItem>
					<DropdownItem onClick={() => column.toggleSorting(true)}>
						<ArrowDownIcon className="size-3.5 text-muted-foreground/70" />
						Desc
					</DropdownItem>
					<DropdownSeparator />
					<DropdownItem onClick={() => column.toggleVisibility(false)}>
						<EyeNoneIcon className="size-3.5 text-muted-foreground/70" />
						Hide
					</DropdownItem>
				</DropdownContent>
			</Dropdown>
		</div>
	);
}

DataTable.ColumnHeader = DataTableColumnHeader;

interface DataTablePaginationProps<TData> {
	table: TSTable<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	return (
		<div
			className={cn(
				"flex flex-row-reverse place-items-center place-content-between gap-4",
				"flex-wrap",
			)}
		>
			{/* <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
			<div
				className={cn(
					"flex items-center gap-x-6 gap-y-2 flex-wrap",
					"*:flex-1 *:w-full *:place-content-between",
				)}
			>
				<div className="flex items-center gap-x-2">
					<p className="text-sm font-medium text-nowrap">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-x-2">
					<div className="flex items-center justify-center text-sm font-medium text-nowrap flex-nowrap">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<DoubleArrowLeftIcon className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeftIcon className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRightIcon className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<DoubleArrowRightIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
DataTable.Pagination = DataTablePagination;

interface DataTableViewOptionsProps<TData> {
	table: TSTable<TData>;
}

export function DataTableViewOptions<TData>({
	table,
}: DataTableViewOptionsProps<TData>) {
	return (
		<Dropdown>
			<DropdownTrigger asChild>
				<Button variant="outline" size="sm" className="ml-auto h-8 space-x-2">
					<MixerHorizontalIcon className="size-4" />
					<span>View</span>
				</Button>
			</DropdownTrigger>
			<DropdownContent align="end" className="w-[150px]">
				<DropdownLabel>Toggle columns</DropdownLabel>
				<DropdownSeparator />
				{table
					.getAllColumns()
					.filter(
						(column) =>
							typeof column.accessorFn !== "undefined" && column.getCanHide(),
					)
					.map((column) => {
						return (
							<DropdownCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{column.id}
							</DropdownCheckboxItem>
						);
					})}
			</DropdownContent>
		</Dropdown>
	);
}
DataTable.ViewOptions = DataTableViewOptions;

interface DataTableFacetedFilterProps<TData, TValue>
	extends FacetedFilterProps {
	column?: Column<TData, TValue>;
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					<PlusCircledIcon className="mr-2 size-4" />
					{title}
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedValues.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value);
											} else {
												selectedValues.add(option.value);
											}
											const filterValues = Array.from(selectedValues);
											column?.setFilterValue(
												filterValues.length ? filterValues : undefined,
											);
										}}
									>
										<div
											className={cn(
												"mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<CheckIcon className={cn("size-4")} />
										</div>
										{option.icon && (
											<option.icon className="mr-2 size-4 text-muted-foreground" />
										)}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center"
									>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
DataTable.Filter = DataTableFacetedFilter;
