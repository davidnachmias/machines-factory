"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { IMachine, Fault } from "@/models/Machine";
import FaultForm from "@/components/FaultForm";

export default function DynamicMachineDetails() {
    const searchParams = useSearchParams();
    const [showFaultForm, setShowFaultForm] = useState(false);
    const [machineData, setMachineData] = useState<IMachine>(JSON.parse(searchParams.get("machine") || "{}"));

    const handleAddFaultClick = () => {
        setShowFaultForm(!showFaultForm);
    };

    const onAddFaultForm = (newFault:Fault) => {
        console.log(newFault, 'newFault===============');
        setMachineData((prevMachineData) => {
            return {
                ...prevMachineData,
                faults: [
                    ...prevMachineData.faults,
                    newFault
                ]
            } as IMachine;
        });
        setShowFaultForm(false);    
    }

    return (
        <div className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">פרטי מכונה</h1>
            {machineData.name ? (
                <>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">שם מכונה: {decodeURI(machineData.name)}</h2>
                    <button 
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleAddFaultClick}
                    >
                        הוסף תקלה
                    </button>
                    {showFaultForm && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 min-h-screen overflow-y-auto">
        <div className="bg-white p-6 sm:p-10 rounded shadow-lg w-11/12 max-w-md mx-auto relative">
            <button 
                className="absolute top-4 right-4 text-black hover:text-gray-700"
                onClick={handleAddFaultClick}
            >
                ✖
            </button>
            <FaultForm machineName={machineData.name} machineId={machineData._id as string} onAddFaultForm={onAddFaultForm} showPopup={true}/>
        </div>
    </div>
)}
                    {machineData.faults.length > 0 ? (
                        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-600">תקלות:</h3>
                            <table className="min-w-full bg-white border-collapse rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">שם מכונה</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">סוג מכונה</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">תיאור</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">תאריך</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">סטטוס</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">סוג טופס</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">חלפים שהוחלפו</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">עלות</th>
                                        <th className="py-3 px-4 border-b-2 border-gray-300 text-right text-gray-600">תאריך סגירה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {machineData.faults.map((fault: Fault, index) => (
                                        <tr key={fault._id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                            <td className="py-3 px-4 border-b border-gray-300">{machineData.name}</td>
                                            <td className="py-3 px-4 border-b border-gray-300">{machineData.type}</td>
                                            <td className="py-3 px-4 border-b border-gray-300">{fault.description}</td>
                                            <td className="py-3 px-4 border-b border-gray-300">{new Date(fault.date).toLocaleDateString('he-IL', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })}</td>
                                            <td className={`py-3 px-4 border-b border-gray-300 ${fault.status === 'open' ? 'bg-red-200' : 'bg-green-200'}`}>{fault.status === 'open' ? 'פתוחה' : 'סגורה'}</td>
                                            <td className="py-3 px-4 border-b border-gray-300">{fault.formType}</td>
                                            <td className="py-3 px-4 border-b border-gray-300">{fault.partsUsed}</td>
                                            <td className="py-3 px-4 border-b border-gray-300">{fault.repairCost?.toString() || ''}</td>
                                            <td className="py-3 px-4 border-b border-gray-300">{fault.closedDate ? new Date(fault.closedDate).toLocaleDateString('he-IL', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            }) : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">אין תקלות עבור מכונה זו</p>
                    )}
                </>
            ) : (
                <p className="text-gray-500">טוען פרטים...</p>
            )}
        </div>
    );
}