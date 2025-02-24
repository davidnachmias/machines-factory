'use client';

import React from "react";
import axios from "axios";

export default function AddMachineForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      machineName: formData.get('machineName') as string,
      machineType: formData.get('machineType') as string,
    };

    try {
      const response = await axios.post('/api/add-machine', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Machine added successfully!');
        form.reset(); // Reset the form here
      } else {
        alert(`Failed to add machine: ${response.data.error}`);
      }
    } catch (error: unknown) {
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`Failed to add machine: ${errorMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-300 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
          הוספת מכונה
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="machineName" className="block text-right mb-2 text-gray-700">
              שם מכונה:
            </label>
            <input
              type="text"
              id="machineName"
              name="machineName"
              className="w-full p-3 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="הכנס שם מכונה"
              required
            />
          </div>
          <div>
            <label htmlFor="machineType" className="block text-right mb-2 text-gray-700">
              סוג מכונה:
            </label>
            <input
              type="text"
              id="machineType"
              name="machineType"
              className="w-full p-3 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="הכנס סוג מכונה"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold shadow-md"
          >
            הוסף מכונה
          </button>
        </form>
      </div>
    </div>
  );
}
