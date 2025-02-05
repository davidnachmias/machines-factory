import AddMachineForm from "@/components/AddMachineForm";
import React from "react";
export const metadata = {
  title: 'הוספת מכונה',
};

export default function Page() {
  return (
    <div>
      <AddMachineForm />
    </div>
  );
}