import { NextApiRequest, NextApiResponse } from "next";

type MachineRequestBody = {
  machineName: string;
  machineType: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { machineName, machineType } = req.body as MachineRequestBody;

    // בדיקות תקינות בסיסיות
    if (!machineName || !machineType) {
      return res.status(400).json({ error: "נא למלא את כל השדות" });
    }

    // כאן תוכל להוסיף לוגיקה לשמירה במסד הנתונים
    console.log("Machine Name:", machineName);
    console.log("Machine Type:", machineType);

    return res.status(200).json({ message: "מכונה נוספה בהצלחה" });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
