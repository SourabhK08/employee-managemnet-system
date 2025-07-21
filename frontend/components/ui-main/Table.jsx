import React from "react";
import TextInput from "./TextInput";
import { Search } from "lucide-react";

const ReusableTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  searchBar = true,
  searchBarPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
}) => {
  return (
    <>
      {searchBar && (
        <div className="mb-3 w-full border rounded-md p-2 flex relative">
          <input
            name="search"
            autoComplete="off"
            placeholder={searchBarPlaceholder}
            className="w-full focus:outline-none"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search size={20} className="absolute right-5" />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-left font-medium"
                >
                  {column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-4 py-6 text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {column.render
                        ? column.render(row[column.accessor], row)
                        : row[column.accessor] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-4 py-6 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReusableTable;
