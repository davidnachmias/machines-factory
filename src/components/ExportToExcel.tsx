import React from "react";
import * as XLSX from "xlsx";

interface ExportToExcelProps {
  data: {
    machineName?: string;
    machineType?: string;
    downtimeDays?: number;
    downtimeHours?: number;
    downtimeMinutes?: number;
    repairCost?: string;
    empty?: number;
  }[];
  sendToMail?: boolean;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data, sendToMail }) => {
  const handleExport = () => {
    // Prepare data with explicit cell formatting
    const formattedData = data.map(row => ({
      "שם מכונה": { v: row.machineName || "", t: 's' },
      "סוג מכונה": { v: row.machineType || "", t: 's' },
      'סה"כ זמן השבתה': {
        v: row.empty ? "" : `${row.downtimeDays} ימים, ${row.downtimeHours} שעות, ${row.downtimeMinutes} דקות`,
        t: 's'
      },
      "עלות תיקון": {
        v: row.repairCost ? `${row.repairCost} ₪` : "",
        t: 's',
        z: '@',
        s: {
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          }
        }
      }
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData, {
      header: ["שם מכונה", "סוג מכונה", 'סה"כ זמן השבתה', "עלות תיקון"]
    });

    // Set RTL
    ws['!dir'] = 'rtl';

    // Set column widths
    ws['!cols'] = [
      { width: 25 },
      { width: 25 },
      { width: 30 },
      { width: 20 }
    ];

    // Apply header styles
    const headerStyle = {
      fill: {
        patternType: 'solid',
        fgColor: { rgb: "C5D9F1" }
      },
      font: {
        bold: true,
        color: { rgb: "000000" }
      },
      alignment: {
        horizontal: 'right',
        vertical: 'center',
        wrapText: true
      },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    // Apply styles to headers and repair cost column
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:D1');
    
    // Apply header styles
    ['A1', 'B1', 'C1', 'D1'].forEach(cellRef => {
      if (ws[cellRef]) ws[cellRef].s = headerStyle;
    });

    // Apply repair cost column styles
    for (let row = 2; row <= range.e.r + 1; row++) {
      const cellRef = `D${row}`;
      if (ws[cellRef]) {
        ws[cellRef].s = {
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
      }
    }

    // Apply border styles to all cells
    for (let row = 2; row <= range.e.r + 1; row++) {
      ['A', 'B', 'C'].forEach(col => {
        const cellRef = `${col}${row}`;
        if (ws[cellRef]) {
          ws[cellRef].s = {
            alignment: {
              horizontal: 'right',
              vertical: 'center'
            },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          };
        }
      });
    }

    // Create workbook and set RTL
    const wb = XLSX.utils.book_new();
    wb.Workbook = {
      Views: [{ RTL: true }]
    };

    XLSX.utils.book_append_sheet(wb, ws, "דוח השבתה");

    if (sendToMail) {
      const excelBlob = new Blob(
        [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const formData = new FormData();
      formData.append("file", excelBlob, "downtime_report.xlsx");

      fetch("/api/send-email", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message || "הדוח נשלח בהצלחה!");
        })
        .catch(() => {
          alert("שגיאה בשליחת הדוח");
        });
    } else {
      XLSX.writeFile(wb, "downtime_report.xlsx");
    }
  };

  return (
    sendToMail ? (
      <button
        onClick={handleExport}
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
      >
        שלח למייל Excel
      </button>
    ) : (
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        הורד Excel
      </button>
    )
  );
};

export default ExportToExcel;