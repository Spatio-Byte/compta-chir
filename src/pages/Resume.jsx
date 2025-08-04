import React, { useEffect, useState } from "react";

export default function Resume() {
  const [deviss, setDeviss] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("deviss");
    if (saved) {
      setDeviss(JSON.parse(saved));
    }
  }, []);

  if (deviss.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center text-gray-400">
        <p className="text-xl font-light">Aucun devis enregistré.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 flex justify-center">
      <div className="max-w-5xl w-full bg-gray-800 rounded-lg shadow-lg overflow-auto">
        <h1 className="text-4xl font-extrabold text-cyan-400 p-6 text-center">
          Résumé des devis
        </h1>

        <table className="w-full border-collapse text-gray-200">
          <thead className="bg-cyan-700">
            <tr>
              <th className="p-3 border border-cyan-600 text-left">Date</th>
              <th className="p-3 border border-cyan-600 text-left">Patient</th>
              <th className="p-3 border border-cyan-600 text-left">Soins</th>
              <th className="p-3 border border-cyan-600 text-right">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {deviss.map((devis, idx) => (
              <tr
                key={idx}
                className="border border-cyan-700 hover:bg-cyan-900 transition-colors"
              >
                <td className="border border-cyan-600 p-3">
                  {new Date(devis.date).toLocaleString()}
                </td>
                <td className="border border-cyan-600 p-3">{devis.patient}</td>
                <td className="border border-cyan-600 p-3">
                  <ul className="list-disc list-inside space-y-1">
                    {devis.soins.map((soin, i) => (
                      <li key={i}>
                        {soin.description} — ${soin.montant.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-cyan-600 p-3 text-right font-semibold">
                  ${devis.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
