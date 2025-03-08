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

    const onAddFaultForm = (newFault: Fault) => {
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
        <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">פרטי מכונה</h1>
            {machineData.name ? (
                <div className="w-full max-w-4xl">
                    <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-700">שם מכונה: {decodeURI(machineData.name)}</h2>
                    <button
                        className="mb-4 px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm md:text-base"
                        onClick={handleAddFaultClick}
                    >
                        הוסף תקלה
                    </button>

                    {showFaultForm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto rtl p-4">
                            <div className="bg-white p-4 md:p-6 lg:p-10 rounded shadow-lg w-full max-w-md mx-auto relative right-0 left-auto">
                                <button
                                    className="absolute top-2 right-2 md:top-4 md:right-4 text-black hover:text-gray-700"
                                    onClick={handleAddFaultClick}
                                >
                                    ✖
                                </button>
                                <FaultForm machineName={machineData.name} machineId={machineData._id as string} onAddFaultForm={onAddFaultForm} showPopup={true} />
                            </div>
                        </div>
                    )}

                    {machineData.faults.length > 0 ? (
                        <div className="w-full bg-white shadow-lg rounded-lg p-3 md:p-6 overflow-hidden">
                            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-600">תקלות:</h3>
                            
                            {/* Desktop view - Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full bg-white border-collapse rounded-lg">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">שם מכונה</th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">סוג מכונה</th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">תיאור</th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">תאריך</th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">סטטוס</th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">סוג טופס</th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">חלפים שהוחלפו</th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">עלות</th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300 text-right text-gray-600">תאריך סגירה</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {machineData.faults.map((fault: Fault, index) => (
                                            <tr key={fault._id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                <td className="py-2 px-3 border-b border-gray-300">{machineData.name}</td>
                                                <td className="py-2 px-3 border-b border-gray-300">{machineData.type}</td>
                                                <td className="py-2 px-3 border-b border-gray-300">{fault.description}</td>
                                                <td className="py-2 px-3 border-b border-gray-300">{new Date(fault.date).toLocaleDateString('he-IL', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })}</td>
                                                <td className={`py-2 px-3 border-b border-gray-300 ${fault.status === 'open' ? 'bg-red-200' : 'bg-green-200'}`}>
                                                    {fault.status === 'open' ? 'פתוחה' : 'סגורה'}
                                                </td>
                                                <td className="py-2 px-3 border-b border-gray-300">{fault.formType}</td>
                                                <td className="py-2 px-3 border-b border-gray-300">{fault.partsUsed}</td>
                                                <td className="py-2 px-3 border-b border-gray-300">{fault.repairCost?.toString() || ''}</td>
                                                <td className="py-2 px-3 border-b border-gray-300">{fault.closedDate ? new Date(fault.closedDate).toLocaleDateString('he-IL', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                }) : ''}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile view - Cards */}
                            <div className="md:hidden space-y-4">
                                {machineData.faults.map((fault: Fault) => (
                                    <div key={fault._id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                                        <div className={`text-sm font-medium mb-2 p-1 rounded-md inline-block ${fault.status === 'open' ? 'bg-red-200' : 'bg-green-200'}`}>
                                            {fault.status === 'open' ? 'פתוחה' : 'סגורה'}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="font-bold">שם מכונה:</div>
                                            <div>{machineData.name}</div>
                                            
                                            <div className="font-bold">סוג מכונה:</div>
                                            <div>{machineData.type}</div>
                                            
                                            <div className="font-bold">תיאור:</div>
                                            <div>{fault.description}</div>
                                            
                                            <div className="font-bold">תאריך:</div>
                                            <div>{new Date(fault.date).toLocaleDateString('he-IL', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            })}</div>
                                            
                                            <div className="font-bold">סוג טופס:</div>
                                            <div>{fault.formType}</div>
                                            
                                            <div className="font-bold">חלפים שהוחלפו:</div>
                                            <div>{fault.partsUsed || '-'}</div>
                                            
                                            <div className="font-bold">עלות:</div>
                                            <div>{fault.repairCost?.toString() || '-'}</div>
                                            
                                            <div className="font-bold">תאריך סגירה:</div>
                                            <div>{fault.closedDate ? new Date(fault.closedDate).toLocaleDateString('he-IL', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            }) : '-'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">אין תקלות עבור מכונה זו</p>
                    )}
                </div>
            ) : (
                <p className="text-gray-500">טוען פרטים...</p>
            )}
        </div>
    );
}