// src/components/OrderTable.js
import React, {useMemo, useState} from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import {fetchOrders} from "@/lib/api";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';


export default function OrderTable() {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const { data, isPending, isError, isSuccess, error } = useQuery({
        queryKey: ['orders', pagination.pageIndex, pagination.pageSize],
        queryFn: () => fetchOrders(pagination.pageIndex, pagination.pageSize),
        keepPreviousData: true
        }
    );

    // Colonnes
    const columns = useMemo(() => [
        {
            accessorKey: 'type',
            header: 'Type',
            cell: info => (
                <span style={{ color: info.getValue() === 'bid' ? 'green' : 'red', fontWeight: 'bold' }}>
          {info.getValue().toUpperCase()}
        </span>
            ),
        },
        { accessorKey: 'pair', header: 'Pair' },
        { accessorKey: 'price', header: 'Price', cell: info => info.getValue() },
        { accessorKey: 'amount', header: 'Amount', cell: info => info.getValue() },
        { accessorKey: 'date', header: 'Date', cell: info => new Date(info.getValue()).toLocaleString() },
    ], []);

    // Table avec pagination serveur (désactive pagination client)
    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        pageCount: data ? Math.ceil(data.totalCount / pagination.pageSize) : -1,
        manualPagination: true,
        state: {pagination},
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isError) return <div>Erreur : {error.message}</div>;

    return (
        <div className="overflow-x-auto">
            <div>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="border border-gray-300 px-4 py-2 text-left bg-gray-100"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {isPending? (
                            <>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                            </>
                        )

                        :table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                className={row.original.type === 'bid' ? 'bg-green-50' : 'bg-red-50'}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="border border-gray-300 px-4 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isSuccess &&
                    <div className="mt-2 flex justify-center items-center gap-4">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            {'<'}
                        </button>
                        <span>
          Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
        </span>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            {'>>'}
                        </button>
                    </div>
                }
            </div>

            {/* Pagination */}

        </div>
    );
}

