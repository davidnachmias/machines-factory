'use client';

import React from "react";

export default function AddMachineForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      machineName: formData.get('machineName') as string,
      machineType: formData.get('machineType') as string,
    };

    const response = await fetch('/api/add-machine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Machine added successfully!');
    } else {
      const errorData = await response.json();
      alert(`Failed to add machine: ${errorData.error}`);
    }
  };

  return (
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
  );
}