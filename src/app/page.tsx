"use client"

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const machines = [
        { name: "מכונה 1" },
        { name: "מכונה 2" },
        { name: "מכונה 3" },
        { name: "מכונה 14" },
    ];

    const handleNavigate = (machineName: string) => {
        router.push(`/machineDetails/${decodeURI(machineName)}`);
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-xl font-bold">מכונות קיימות</h1>
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
        </div>
    );
}