"use client";

import React, { useState } from 'react';

export default function CloseFault() {
    // הגדרת משתנים עבור המידע שיש להציג
    const [machineName, setMachineName] = useState("מכונה 1");
    const [faultDescription, setFaultDescription] = useState("התקלה במערכת החשמל");
    const [parts, setParts] = useState("חוטים, מתג");
    const [cost, setCost] = useState('500 ש"ח');
    const [openingDate, setOpeningDate] = useState("01/01/2025");

    // טיפול בהגשה של הטופס
    const handleCloseFault = () => {
        // כאן תוכל להוסיף את הלוגיקה של סגירת התקלה
        console.log("התקלה נסגרה");
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-lg space-y-8 transform transition-all hover:scale-105 hover:shadow-2xl duration-300">
                <h1 className="text-3xl font-semibold text-center text-gray-800">סגירת תקלה</h1>
                
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <span className="text-lg text-gray-600">שם מכונה:</span>
                        <p className="text-lg font-medium text-gray-800">{machineName}</p>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-lg text-gray-600">מהות התקלה:</span>
                        <p className="text-lg font-medium text-gray-800">{faultDescription}</p>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-lg text-gray-600">חלפים:</span>
                        <p className="text-lg font-medium text-gray-800">{parts}</p>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-lg text-gray-600">עלות:</span>
                        <p className="text-lg font-medium text-gray-800">{cost}</p>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-lg text-gray-600">תאריך פתיחה:</span>
                        <p className="text-lg font-medium text-gray-800">{openingDate}</p>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleCloseFault}
                        className="w-full py-3 mt-4 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all hover:shadow-2xl transform duration-300"
                    >
                        אישור
                    </button>
                </div>
            </div>
        </div>
    );
}
