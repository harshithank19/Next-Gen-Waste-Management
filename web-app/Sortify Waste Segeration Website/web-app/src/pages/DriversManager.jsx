// src/pages/DriversManager.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Button } from "@/components/ui/button";

/**
 * DriversManager
 * Handles viewing, creating, editing, and deleting driver profiles.
 */

export default function DriversManager({ onDriverCreated }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editing, setEditing] = useState(null);

  /* ---------------------------- LOAD EXISTING DRIVERS ---------------------------- */
  const fetchDrivers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, is_driver, created_at")
      .eq("is_driver", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading drivers:", error);
      setError(error.message);
    } else {
      setDrivers(data || []);
      setError("");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();

    // ✅ Realtime updates for driver changes
    const channel = supabase
      .channel("drivers-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        (payload) => {
          console.log("Realtime change:", payload);

          switch (payload.eventType) {
            case "INSERT":
              if (payload.new?.is_driver) {
                setDrivers((prev) => [payload.new, ...prev]);
              }
              break;

            case "UPDATE":
              if (payload.new?.is_driver) {
                setDrivers((prev) =>
                  prev.map((d) => (d.id === payload.new.id ? payload.new : d))
                );
              }
              break;

            case "DELETE":
              setDrivers((prev) => prev.filter((d) => d.id !== payload.old.id));
              break;

            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ---------------------------- CREATE NEW DRIVER ---------------------------- */
  const createDriverProfile = async (e) => {
    e?.preventDefault?.();

    if (!newEmail.trim()) return alert("Enter driver email.");
    if (!newFullName.trim()) {
      if (!window.confirm("Create driver without a full name?")) return;
    }

    const defaultPwd = Math.random().toString(36).slice(-8) + "A1!";
    const initialPassword = window.prompt(
      "Set initial password for driver (share this with driver):",
      defaultPwd
    );
    if (!initialPassword) return alert("Cancelled — password required.");

    try {
      // 🔥 Call backend to create Supabase auth user + profile
      const resp = await fetch("http://localhost:4000/create-driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-api-key": import.meta.env.VITE_CREATE_DRIVER_API_KEY || "",
        },
        body: JSON.stringify({
          email: newEmail,
          password: initialPassword,
          full_name: newFullName,
        }),
      });

      const json = await resp.json();
      console.log("create-driver response:", resp.status, json);

      if (!resp.ok) {
        console.error("Backend error:", json);
        alert(
          "Error creating driver: " +
            (json.error?.message || JSON.stringify(json))
        );
        return;
      }

      const createdProfile =
        json.profile ||
        (Array.isArray(json) ? json[0] : json?.profiles ?? json?.profile);
      if (!createdProfile?.id) {
        alert("Driver created but response was unexpected. Refresh to verify.");
      } else {
        // ✅ Instantly update UI
        setDrivers((p) => [
          createdProfile,
          ...p.filter((d) => d.id !== createdProfile.id),
        ]);
        onDriverCreated?.(createdProfile);
        alert(
          `✅ Driver created successfully!\nTemporary password: ${initialPassword}`
        );

        // 🧩 Refresh drivers list from Supabase to stay in sync
        await fetchDrivers();
      }

      // Clear input fields
      setNewFullName("");
      setNewEmail("");
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error: " + (err?.message || String(err)));
    }
  };

  /* ---------------------------- EDIT DRIVER ---------------------------- */
  const saveEdit = async () => {
    if (!editing?.id) return;
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: editing.full_name,
        email: editing.email,
        is_driver: editing.is_driver,
      })
      .eq("id", editing.id)
      .select()
      .single();

    if (error) {
      console.error("Update driver error:", error);
      alert("Error: " + error.message);
    } else {
      setEditing(null);
      setDrivers((p) => p.map((d) => (d.id === data.id ? data : d)));
      onDriverCreated?.(data);
      alert("Driver updated successfully!");
    }
  };

  /* ---------------------------- DELETE DRIVER ---------------------------- */
  const deleteDriver = async (id) => {
    if (
      !window.confirm(
        "Delete driver profile? This will not delete their auth account."
      )
    )
      return;

    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      console.error("Delete profile error:", error);
      alert("Error: " + error.message);
    } else {
      setDrivers((p) => p.filter((d) => d.id !== id));
      onDriverCreated?.({ id, deleted: true });
      alert("Driver deleted successfully.");
    }
  };

  /* ---------------------------- UI RENDER ---------------------------- */
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-semibold text-green-400">
        Drivers Management
      </h2>

      {/* Create Form */}
      <form
        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
        onSubmit={createDriverProfile}
      >
        <div>
          <label className="text-xs text-slate-300">Full name</label>
          <input
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            placeholder="e.g., Bob Driver"
            className="block w-full p-2 rounded bg-slate-700"
          />
        </div>

        <div>
          <label className="text-xs text-slate-300">Email</label>
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="driver@example.com"
            className="block w-full p-2 rounded bg-slate-700"
          />
        </div>

        <div className="flex items-center">
          <label className="text-xs text-slate-300 mr-2">is_driver</label>
          <input type="checkbox" checked readOnly />
        </div>

        <div>
          <Button type="submit" className="bg-green-500 w-full">
            Create Driver
          </Button>
        </div>
      </form>

      {/* Existing Drivers */}
      <div>
        <h3 className="text-lg mb-2 text-slate-200">Existing drivers</h3>
        {loading && <div className="text-slate-400">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}

        <ul className="space-y-2 mt-2">
          {drivers.length === 0 && !loading && (
            <p className="text-slate-400">No drivers available</p>
          )}

          {drivers.map((d) => (
            <li
              key={d.id}
              className="bg-slate-700 p-3 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-white">
                  {d.full_name || "— no name —"}
                </div>
                <div className="text-xs text-slate-400">
                  {d.email || "— no email —"}
                </div>
                <div className="text-xs text-slate-500">id: {d.id}</div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-yellow-600" onClick={() => setEditing(d)}>
                  Edit
                </Button>
                <Button className="bg-red-600" onClick={() => deleteDriver(d.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-800 p-4 rounded w-full max-w-md">
            <h4 className="text-lg mb-3 text-green-400">Edit Driver</h4>

            <label className="text-xs text-slate-300">Full name</label>
            <input
              value={editing.full_name || ""}
              onChange={(e) =>
                setEditing({ ...editing, full_name: e.target.value })
              }
              className="block w-full p-2 rounded bg-slate-700 mb-2"
            />

            <label className="text-xs text-slate-300">Email</label>
            <input
              value={editing.email || ""}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
              className="block w-full p-2 rounded bg-slate-700 mb-2"
            />

            <div className="flex gap-2 justify-end mt-3">
              <Button onClick={() => setEditing(null)} className="bg-gray-500">
                Cancel
              </Button>
              <Button onClick={saveEdit} className="bg-blue-600">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
