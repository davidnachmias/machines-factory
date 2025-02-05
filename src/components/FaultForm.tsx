"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IMachine } from '@/models/Machine';

const FaultForm: React.FC = () => {
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
            alert('Please select a machine');
            return;
        }

        const data = {
            machineId: selectedMachine,
            formType,
            description,
            date: new Date().toISOString(),
        };

        try {
            const response = await axios.post('/api/add-fault', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('Fault added successfully!');
            } else {
                alert(`Failed to add fault: ${response.data.error}`);
            }
        } catch (error: any) {
            alert(`Failed to add fault: ${error.message}`);
        }
    };

    return (
        <div className='p-8 mt-10'>
            <h1 className="text-xl font-bold mb-10">הוספת תקלה/טיפול תקופתי</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
            <div>
                <label htmlFor="machine" className="block text-sm font-medium text-gray-700">בחר מכונה</label>
                <select
                    id="machine"
                    value={selectedMachine}
                    onChange={handleMachineChange}
                    className="w-full px-4 py-2 border rounded-md mt-2"
                >
                    <option value="">בחר מכונה</option>
                    {machines.map(machine => (
                        <option key={String(machine._id)} value={String(machine._id)}>{machine.name}</option>
                    ))}
                </select>
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
                disabled={!selectedMachine || !formType || !description}
            >
                {submitLabel}
            </button>
        </form>
        </div>
    );
};

export default FaultForm;