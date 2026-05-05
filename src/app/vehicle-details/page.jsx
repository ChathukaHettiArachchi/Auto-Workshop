"use client";

import { useState } from "react";

export default function VehicleDetails() {
  const [showModal, setShowModal] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [job, setJob] = useState({
    customer: "",
    vehicle: "",
    date: "",
  });

  const [items, setItems] = useState([
    { description: "", cost: "" },
  ]);

const [materials, setMaterials] = useState([
  { name: "", qty: "", price: "" },
]);

  // Add new labour row
  const handleAddItem = () => {
    setItems([...items, { description: "", cost: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };


const handleAddMaterial = () => {
  setMaterials([...materials, { name: "", qty: "", price: "" }]);
};

const handleMaterialChange = (index, field, value) => {
  const updated = [...materials];
  updated[index][field] = value;
  setMaterials(updated);
};
  

  const handleSubmit = (e) => {
  e.preventDefault();

  // 🔹 Labour total
  const labourTotal = items.reduce(
    (sum, i) => sum + Number(i.cost || 0),
    0
  );

  // 🔹 Material total
  const materialTotal = materials.reduce(
    (sum, m) =>
      sum + Number(m.qty || 0) * Number(m.price || 0),
    0
  );

  const newJob = {
    ...job,
    items,
    materials,
    labourTotal,
    materialTotal,
    total: labourTotal + materialTotal,
  };

  setJobs([...jobs, newJob]);

  // reset
  setShowModal(false);
  setJob({ customer: "", vehicle: "", date: "" });
  setItems([{ description: "", cost: "" }]);
  setMaterials([{ name: "", qty: "", price: "" }]);
};
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicle Jobs</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 px-4 py-2 rounded-lg"
        >
          + Add New Job
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total (LKR)</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No jobs yet
                </td>
              </tr>
            )}

            {jobs.map((j, i) => (
              <tr key={i} className="border-t border-gray-700">
                <td className="p-3">{j.customer}</td>
                <td className="p-3">{j.vehicle}</td>
                <td className="p-3">{j.date}</td>
                <td className="p-3">{j.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-lg">

            <h2 className="text-xl font-bold mb-4">Add Job</h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                type="text"
                placeholder="Customer"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setJob({ ...job, customer: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Vehicle"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setJob({ ...job, vehicle: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full p-2 rounded bg-gray-700"
                onChange={(e) =>
                  setJob({ ...job, date: e.target.value })
                }
              />

              {/* Labour items */}
              <div>
                <h3 className="mb-2">Labour Works</h3>

                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      className="flex-1 p-2 rounded bg-gray-700"
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />

                    <input
                      type="number"
                      placeholder="Cost"
                      className="w-24 p-2 rounded bg-gray-700"
                      onChange={(e) =>
                        handleItemChange(index, "cost", e.target.value)
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-blue-400 text-sm"
                >
                  + Add Labour
                </button>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 rounded"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}