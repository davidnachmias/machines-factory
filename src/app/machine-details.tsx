import { useRouter } from "next/router";

export default function MachineDetails() {
  const router = useRouter();
  const { name } = router.query; // קבלת שם המכונה מה-URL

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8">
      <h1 className="text-xl font-bold">פרטי מכונה</h1>
      {name ? (
        <p className="text-lg">שם המכונה: {name}</p>
      ) : (
        <p>טוען פרטים...</p>
      )}
    </div>
  );
}
