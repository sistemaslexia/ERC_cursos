"use client";
import { useState } from "react";

export default function TestPurchaseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    value: "299.00",
    currency: "MXN",
  });

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const sendTestPurchase = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-pixels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          value: parseFloat(formData.value),
          currency: formData.currency,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-all z-50 flex items-center gap-2"
        title="Enviar evento de prueba a Meta"
      >
        <span>🧪</span>
        <span className="hidden sm:inline">Test Purchase Event</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              🧪 Test Purchase Event
            </h2>
            <p className="text-sm text-gray-800 mt-1">
              Enviar evento de compra de prueba a Meta
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={sendTestPurchase}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4 font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Enviando...
            </span>
          ) : (
            "Enviar Evento de Compra"
          )}
        </button>

        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{result.success ? "✅" : "❌"}</span>
              <div className="flex-1 text-sm">
                <p
                  className={`font-medium mb-1 ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.success ? "Evento enviado exitosamente" : "Error"}
                </p>
                {result.message && (
                  <p className="text-gray-700 mb-2">{result.message}</p>
                )}
                {result.eventId && (
                  <p className="text-xs text-gray-600 mb-2">
                    Event ID: {result.eventId}
                  </p>
                )}
                {result.verifyInstructions && (
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <p className="font-medium">Verificar en Meta:</p>
                    <p>1. Ve a Events Manager</p>
                    <p>2. Click en "Test Events"</p>
                    <p>3. Filtra por código: TEST88124</p>
                  </div>
                )}
                {result.error && (
                  <p className="text-red-700 text-xs mt-2">
                    {JSON.stringify(result.error)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>💡 Tip:</strong> Usa el código{" "}
            <code className="bg-blue-100 px-1 py-0.5 rounded">TEST88124</code>{" "}
            en Meta Events Manager para ver estos eventos de prueba.
          </p>
        </div>
      </div>
    </div>
  );
}
