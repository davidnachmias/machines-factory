"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Machine {
    name: string;
    type: string;
}

const MachinesList: React.FC = () => {
    const router = useRouter();
    const [machines, setMachines] = useState<Machine[]>([]);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await axios.get<Machine[]>('/api/machines');
                setMachines(response.data);
            } catch (error) {
                console.error("Error fetching machines:", error);
            }
        };

        fetchMachines();
    }, []);

    const handleNavigate = (machineName: string) => {
        router.push(`/machineDetails/${decodeURI(machineName)}`);
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
            {machines.map((machine, index) => (
                <button
                    key={index}
                    onClick={() => handleNavigate(machine.name)}
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    {machine.name}
                </button>
            ))}
        </div>
    );
};

export default MachinesList;