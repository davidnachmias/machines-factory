"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IMachine, Fault } from '@/models/Machine';

interface FaultFormProps {
    machineName?: string;
    machineId?: string;
    showPopup?: boolean;
    onAddFaultForm?: (newFault: Fault) => void;
}

const FaultForm: React.FC<FaultFormProps> = ({ machineName, machineId, onAddFaultForm, showPopup }) => {
    const [machines, setMachines] = useState<IMachine[]>([]);
    const [selectedMachine, setSelectedMachine] = useState<string>('');
    const [formType, setFormType] = useState<string>('תקלה');
    const [description, setDescription] = useState<string>('');
    const [submitLabel, setSubmitLabel] = useState<string>('הוסף תקלה');

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
        if (machineId) {
            setSelectedMachine(machineId);
        }
    }, []);

    const handleMachineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMachine(e.target.value);
    };

    const handleFormTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setFormType(selectedValue);

        if (selectedValue === 'תקלה') {
            setSubmitLabel('הוסף תקלה');
        } else if (selectedValue === 'טיפול תקופתי') {
            setSubmitLabel('הוסף טיפול תקופתי');
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedMachineData = machines.find(machine => machine._id === selectedMachine);
        if (!selectedMachineData) {
            alert('אנא בחר מכונה');
            return;
        }

        const data = {
            _id: selectedMachine,
            formType,
            description,
            date: new Date().toISOString(),
            status: 'open',
        };

        try {
            const response = await axios.post('/api/add-fault', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('הפעולה נוספה בהצלחה!');
                if (onAddFaultForm) {
                    onAddFaultForm(data);
                }
                setSelectedMachine('');
                setFormType('תקלה');
                setDescription('');
                setSubmitLabel('הוסף תקלה');
            } else {
                alert(`שגיאה בהוספת הפעולה: ${response.data.error}`);
            }
        } catch (error: unknown) {
            let errorMessage = 'שגיאה לא ידועה';
            if (error instanceof Error) {
              errorMessage = error.message;
            }
            alert(`שגיאה בהוספת הפעולה: ${errorMessage}`);
        }
    };

    return (
        <div className={showPopup ? 'flex' : 'flex justify-center items-center min-h-screen'}>
            <div className='w-full max-w-md p-8 bg-white shadow-lg rounded-lg'>
                <h1 className="text-xl font-bold mb-10 text-center">הוספת תקלה/טיפול תקופתי</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        {machineName ? (
                            <h2 className="text-lg font-medium text-gray-700 text-center">{machineName}</h2>
                        ) : (
                            <>
                                <label htmlFor="machine" className="block text-sm font-medium text-gray-700">בחר מכונה</label>
                                <select
                                    id="machine"
                                    value={selectedMachine}
                                    onChange={handleMachineChange}
                                    className="w-full px-4 py-2 border rounded-md mt-2"
                                >
                                    <option value="">בחר מכונה</option>
                                    {machines.map((machine, index) => (
                                        <option key={`${machine._id}-${index}`} value={String(machine._id)}>{machine.name}</option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
    
                    <div>
                        <label htmlFor="formType" className="block text-sm font-medium text-gray-700">בחר סוג פעולה</label>
                        <select
                            id="formType"
                            value={formType}
                            onChange={handleFormTypeChange}
                            className="w-full px-4 py-2 border rounded-md mt-2"
                        >
                            <option value="תקלה">פתיחת תקלה</option>
                            <option value="טיפול תקופתי">טיפול תקופתי</option>
                        </select>
                    </div>
    
                    {formType && (
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                תיאור {formType === 'תקלה' ? 'התקלה' : 'הטיפול'}
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={handleDescriptionChange}
                                placeholder={`הכנס ${formType === 'תקלה' ? 'התקלה' : 'הטיפול'}`}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                        </div>
                    )}
    
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        {submitLabel}
                    </button>
                </form>
            </div>
        </div>
    );
    
};

export default FaultForm;
