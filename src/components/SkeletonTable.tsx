import React from "react";

const SkeletonTable = () => {
  return (
    <div className="p-8 mt-10 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">דוח השבתה ועלות</h2>
      <div className="mb-4 w-full max-w-lg">
        <div className="h-10 bg-gray-300 animate-pulse rounded"></div>
      </div>
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-200">
            {[...Array(7)].map((_, i) => (
              <th key={i} className="border p-2">
                <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border">
              {[...Array(7)].map((_, j) => (
                <td key={j} className="border p-2">
                  <div className="h-6 bg-gray-300 animate-pulse rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
