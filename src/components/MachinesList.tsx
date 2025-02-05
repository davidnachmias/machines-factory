"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IMachine } from "@/models/Machine";

const MachinesList: React.FC = () => {
    const router = useRouter();
    const [machines, setMachines] = useState<IMachine[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await axios.get<IMachine[]>('/api/machines');
                setMachines(response.data);
            } catch (error) {
                console.error("Error fetching machines:", error);
            }
        };

        fetchMachines();
    }, []);

    const handleNavigate = (machine: IMachine) => {
      router.push(`/machineDetails/${encodeURIComponent(machine.name)}?machine=${encodeURIComponent(JSON.stringify(machine))}`);
  };

    const filteredMachines = machines.filter((machine) =>
        machine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
   

      return (
        <div className="p-8 mt-10 flex flex-col items-center">
            <h1 className="text-xl font-bold mb-8">מכונות קיימות</h1>
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <input
            type="text"
            placeholder="חפש מכונה..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          {filteredMachines.length > 0 ? (
            filteredMachines.map((machine) => (
              <button
                key={String(machine._id)} // שימוש ב-ID במקום index
                onClick={() => handleNavigate(machine)}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {machine.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500">לא נמצאו מכונות</p>
          )}
        </div>
        </div>
      );
    };
    
export default MachinesList;