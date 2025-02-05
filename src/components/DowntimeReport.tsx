"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import ExportToPDF from "./ExportToPdf";

interface ClosedFault {
    machineName: string;
    machineType: string;
    closedDate: string;
    date: string;
    repairCost?: number;
    downtimeDays: number;
    downtimeHours: number;
    downtimeMinutes: number;
}

export default function DowntimeReport() {
    const [closedFaults, setClosedFaults] = useState<ClosedFault[]>([]);
    const [filteredFaults, setFilteredFaults] = useState<ClosedFault[]>([]);
    const [machineNames, setMachineNames] = useState<string[]>([]);
    const [selectedMachine, setSelectedMachine] = useState<string>("כל המכונות");

    const [totalDowntime, setTotalDowntime] = useState({ days: 0, hours: 0, minutes: 0 });
    const [totalRepairCost, setTotalRepairCost] = useState(0);

    const formattedData = [
        ...filteredFaults.map((fault) => ({
            machineName: fault.machineName,
            machineType: fault.machineType,
            downtimeDays: fault.downtimeDays,
            downtimeHours: fault.downtimeHours,
            downtimeMinutes: fault.downtimeMinutes,
            repairCost: fault.repairCost ? `${fault.repairCost}` : "לא זמין"
        })),
        {
            empty: 1,
        },
        {
            machineType: 'סך הכל',
            downtimeDays: totalDowntime.days,
            downtimeHours: totalDowntime.hours,
            downtimeMinutes: totalDowntime.minutes,
            repairCost: `${totalRepairCost}`
        }
    ];
    
    useEffect(() => {
        const fetchClosedFaults = async () => {
            try {
                const response = await axios.get<ClosedFault[]>("/api/closed-faults");

                const namesSet = new Set<string>();

                const faultsWithDowntime = response.data.map((fault) => {
                    const startDate = new Date(fault.date);
                    const endDate = new Date(fault.closedDate);
                    const downtimeMs = endDate.getTime() - startDate.getTime();

                    const downtimeDays = Math.floor(downtimeMs / (1000 * 60 * 60 * 24));
                    const downtimeHours = Math.floor((downtimeMs / (1000 * 60 * 60)) % 24);
                    const downtimeMinutes = Math.floor((downtimeMs / (1000 * 60)) % 60);

                    namesSet.add(fault.machineName);

                    return { ...fault, downtimeDays, downtimeHours, downtimeMinutes };
                });

                setClosedFaults(faultsWithDowntime);
                setMachineNames(["כל המכונות", ...Array.from(namesSet)]);
            } catch (error) {
                console.error("Error fetching closed faults:", error);
            }
        };

        fetchClosedFaults();
    }, []);

    useEffect(() => {
        const filtered = selectedMachine === "כל המכונות"
            ? closedFaults
            : closedFaults.filter(fault => fault.machineName === selectedMachine);

        let totalDays = 0, totalHours = 0, totalMinutes = 0, totalCost = 0;

        filtered.forEach(fault => {
            totalDays += fault.downtimeDays;
            totalHours += fault.downtimeHours;
            totalMinutes += fault.downtimeMinutes;
            totalCost += fault.repairCost || 0;
        });

        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes %= 60;
        totalDays += Math.floor(totalHours / 24);
        totalHours %= 24;

        setFilteredFaults(filtered);
        setTotalDowntime({ days: totalDays, hours: totalHours, minutes: totalMinutes });
        setTotalRepairCost(totalCost);
    }, [selectedMachine, closedFaults]);

    return (
        <div className="p-8 mt-10 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">דוח השבתה ועלות</h2>

            <div className="mb-4">
                <label htmlFor="machineSelect" className="font-bold mr-2">בחר מכונה:</label>
                <select
                    id="machineSelect"
                    value={selectedMachine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="border p-2"
                >
                    {machineNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            <table className="min-w-full bg-white border border-gray-300 shadow-md mb-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">שם מכונה</th>
                        <th className="border p-2">סוג מכונה</th>
                        <th className="border p-2">זמן השבתה</th>
                        <th className="border p-2">עלות תיקון</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFaults.map((fault, index) => (
                        <tr key={index} className="border">
                            <td className="border p-2">{fault.machineName}</td>
                            <td className="border p-2">{fault.machineType}</td>
                            <td className="border p-2">
                                {fault.downtimeDays ?? 0} ימים, {fault.downtimeHours ?? 0} שעות, {fault.downtimeMinutes ?? 0} דקות
                            </td>
                            <td className="border p-2">{fault.repairCost ? `${fault.repairCost} ₪` : "0"}</td>
                        </tr>
                    ))}
                    {filteredFaults.length > 0 && (
                        <tr className="bg-gray-300 font-bold">
                            <td className="border p-2 text-center" colSpan={2}>סך הכל</td>
                            <td className="border p-2">
                                {totalDowntime.days ?? 0} ימים, {totalDowntime.hours ?? 0} שעות, {totalDowntime.minutes ?? 0} דקות
                            </td>
                            <td className="border p-2">{totalRepairCost} ₪</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="min-w-full flex mt-6 justify-evenly">
                <ExportToPDF data={formattedData} sendToMail={false}  />
                <ExportToPDF data={formattedData} sendToMail={true} />
            </div>
        </div>
    );
}
