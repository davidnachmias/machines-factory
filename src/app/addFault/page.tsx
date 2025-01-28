"use client";

import React, { useState } from 'react';

export default function Page() {
    // הגדרת ערך ברירת מחדל של "תקלה"
    const [formType, setFormType] = useState<string>('תקלה');
    const [description, setDescription] = useState<string>(''); // משתנה שמתאר את התיאור
    const [submitLabel, setSubmitLabel] = useState<string>('הוסף תקלה'); // טקסט לכפתור

    // עדכון סוג הטופס על פי הבחירה בסלקט
    const handleFormTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setFormType(selectedValue);

        // עדכון טקסט הכפתור לפי הבחירה
        if (selectedValue === 'תקלה') {
            setSubmitLabel('הוסף תקלה');
        } else if (selectedValue === 'טיפול תקופתי') {
            setSubmitLabel('הוסף טיפול תקופתי');
        }
    };

    // טיפול בשדה תיאור התקלה
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    // שליחת הטופס
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // כאן תוכל להוסיף את הלוגיקה לשליחת הנתונים לשרת או לכל פעולה אחרת
        console.log(`סוג הטופס: ${formType}, תיאור: ${description}`);
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-xl font-bold">הוספת תקלה/טיפול תקופתי</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
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
                            rows={3} // מספר השורות שיהיו מוצגות
                            className="w-full px-4 py-2 border rounded-md mt-2"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    disabled={!formType || !description}
                >
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}
