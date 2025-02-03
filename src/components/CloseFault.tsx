"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Fault {
    _id: string;
    machineName: string;
    machineType: string;
    formType: string;
    description: string;
    date: string;
    status: string; // חדש: שדה סטטוס
}

export default function CloseFault() {
    const [faults, setFaults] = useState<Fault[]>([]);
    const [selectedFault, setSelectedFault] = useState<Fault | null>(null);

    useEffect(() => {
        const fetchFaults = async () => {
            try {
                const response = await axios.get<Fault[]>('/api/open-faults');
                setFaults(response.data);
                console.log(response.data, '----=---=');
            } catch (error) {
                console.error("Error fetching faults:", error);
            }
        };

        fetchFaults();
    }, []);

    const handleCloseFault = async (fault: Fault) => {
        try {
            const response = await axios.post('/api/close-fault', { faultId: fault._id });
            if (response.status === 200) {
                alert('Fault closed successfully!');
                setFaults(faults.filter(f => f._id !== fault._id));
            } else {
                alert(`Failed to close fault: ${response.data.error}`);
            }
        } catch (error: any) {
            alert(`Failed to close fault: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-8">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">סגירת תקלה</h1>
            <div className="w-full max-w-6xl">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">שם מכונה</th>
                            <th className="py-2 px-4 border-b">סוג מכונה</th>
                            <th className="py-2 px-4 border-b">סוג פעולה</th>
                            <th className="py-2 px-4 border-b">תאריך פתיחה</th>
                            <th className="py-2 px-4 border-b">תיאור התקלה</th>
                            <th className="py-2 px-4 border-b">פעולה</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faults.map((fault, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b">{fault.machineName}</td>
                                <td className="py-2 px-4 border-b">{fault.machineType}</td>
                                <td className="py-2 px-4 border-b">{fault.formType}</td>
                                <td className="py-2 px-4 border-b">{fault.date}</td>
                                <td className="py-2 px-4 border-b">{fault.description}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleCloseFault(fault)}
                                        className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        סגור תקלה
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}