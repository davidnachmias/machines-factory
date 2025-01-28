"use client"
import { useParams } from "next/navigation";

export default function DynamicMachineDetails() {
    const params = useParams();
    const machineName = Array.isArray(params.machineName) ? params.machineName[0] : params.machineName;

    return (
        <div className="grid items-center justify-items-center min-h-screen p-8">
            <h1 className="text-xl font-bold">פרטי מכונה</h1>
            {machineName ? (
                <p className="text-lg">שם המכונה: {decodeURI(machineName)}</p>
            ) : (
                <p>טוען פרטים...</p>
            )}
        </div>
    );
}