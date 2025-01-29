import AddMachineForm from "@/components/AddMachineForm";
import React from "react";
export const metadata = {
  title: 'הוספת מכונה',
};

export default function Page() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-xl font-bold">הוספת מכונה</h1>
      <AddMachineForm />
    </div>
  );
}