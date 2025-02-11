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
    <div className="p-8 mt-10 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-8">הוספת מכונה</h1>
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-md">
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