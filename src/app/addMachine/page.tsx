import React from "react";

export default function Page() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-xl font-bold">הוספת מכונה</h1>
      <form
        // action="/services/add-machine" // הנתיב שבו השרת יקבל את הבקשה
        // method="POST"
        className="flex flex-col items-center gap-6 w-full max-w-md"
      >
        <div className="w-full">
          <label htmlFor="machineName" className="block text-right mb-2">
            שם מכונה:
          </label>
          <input
            type="text"
            id="machineName"
            name="machineName"
            className="w-full p-2 border rounded-md text-right"
            placeholder="הכנס שם מכונה"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="machineType" className="block text-right mb-2">
            סוג מכונה:
          </label>
          <input
            type="text"
            id="machineType"
            name="machineType"
            className="w-full p-2 border rounded-md text-right"
            placeholder="הכנס סוג מכונה"
            required
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          הוסף מכונה
        </button>
      </form>
    </div>
  );
}
