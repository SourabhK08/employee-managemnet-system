import React from "react";

const ReusableTable = ({ columns, data, loading = false, emptyMessage = "No data available" }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
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
          {data.map((row, rowIndex) => (
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
                    : row[column.accessor] || '-'
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable