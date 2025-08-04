import React, { useState } from "react";

export default function Devis() {
  const [patient, setPatient] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [soins, setSoins] = useState([{ description: "", montant: "" }]);
  const [webhook, setWebhook] = useState(localStorage.getItem("webhook") || "");
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState("");


  const handleSoinsChange = (index, field, value) => {
    const updated = soins.map((soin, i) =>
      i === index ? { ...soin, [field]: value } : soin
    );
    setSoins(updated);
  };

  const addSoin = () => setSoins([...soins, { description: "", montant: "" }]);

  const removeSoin = (index) => {
    if (soins.length === 1) return; 
    setSoins(soins.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!patient.trim() || !webhook.trim()) {
      setMessage({ type: "error", text: "Patient et lien webhook sont obligatoires." });
      return;
    }
    if (soins.some((s) => !s.description.trim() || !s.montant || isNaN(s.montant))) {
      setMessage({ type: "error", text: "Tous les soins doivent avoir description et montant valides." });
      return;
    }

    const total = soins.reduce((acc, s) => acc + parseFloat(s.montant), 0);

    const form = {
      patient,
      date,
      soins: soins.map((s) => ({ description: s.description, montant: parseFloat(s.montant) })),
      total,
    };

    
    localStorage.setItem("webhook", webhook);

    
    const saved = JSON.parse(localStorage.getItem("deviss")) || [];
    saved.push(form);
    localStorage.setItem("deviss", JSON.stringify(saved));

   
    const embed = {
      title: `Devis - ${patient}`,
      description: `Date: ${new Date(date).toLocaleString()}`,
      color: 0x00bfff,
      fields: soins.map((s, i) => ({
        name: `Soin ${i + 1}`,
        value: `${s.description} — $${parseFloat(s.montant).toFixed(2)}`,
        inline: false,
      })),
      footer: { text: `Total: $${total.toFixed(2)}| User: ${user}` },
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });

      setMessage({ type: "success", text: "Devis envoyé et sauvegardé avec succès !" });

      
      setPatient("");
      setDate(new Date().toISOString().slice(0, 16));
      setSoins([{ description: "", montant: "" }]);
    } catch (error) {
      setMessage({ type: "error", text: `Erreur lors de l'envoi du webhook. erreur : ${error}` });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-200 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full p-8 space-y-6 overflow-hidden"
      >
        <h1 className="text-4xl font-extrabold mb-4 text-cyan-400 text-center">Créer un Devis</h1>

        <div>
          <label className="block mb-1 font-semibold">Patient</label>
          <input
            type="text"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            className="w-full rounded bg-gray-700 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Nom du patient"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Nom du médecin</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full rounded bg-gray-700 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="pseudo discord (eviter les fautes de frappes)"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date et heure</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded bg-gray-700 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Lien Webhook Discord</label>
          <input
            type="url"
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            className="w-full rounded bg-gray-700 text-gray-100 p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="https://discord.com/api/webhooks/..."
            required
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3 border-b border-cyan-400 pb-1">Soins</h2>
          {soins.map((soin, i) => (
            <div
              key={i}
              className="flex gap-4 mb-3 items-center bg-gray-700 p-4 rounded-md shadow-inner"
            >
              <input
                type="text"
                placeholder="Description"
                value={soin.description}
                onChange={(e) => handleSoinsChange(i, "description", e.target.value)}
                className="flex-1 rounded bg-gray-600 text-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
              <input
                type="number"
                placeholder="Montant ($)"
                value={soin.montant}
                onChange={(e) => handleSoinsChange(i, "montant", e.target.value)}
                className="w-32 rounded bg-gray-600 text-gray-200 p-2 text-right focus:outline-none focus:ring-2 focus:ring-cyan-400"
                step="0.01"
                min="0"
                required
              />
              {soins.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSoin(i)}
                  className="text-red-400 hover:text-red-600 font-bold px-2"
                  aria-label="Supprimer ce soin"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSoin}
            className="mt-2 inline-block bg-cyan-500 hover:bg-cyan-600 rounded px-4 py-2 font-semibold transition"
          >
            + Ajouter un soin
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded ${
              message.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 font-bold py-3 rounded transition"
        >
          Envoyer et sauvegarder
        </button>
      </form>
    </div>
  );
}

