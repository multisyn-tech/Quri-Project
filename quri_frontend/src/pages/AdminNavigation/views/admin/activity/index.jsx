import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all activity from backend
  const fetchAllActivity = async () => {
    try {
      const response = await fetch(`${BASE_URL}/customers/get_all_activity`);
      if (!response.ok) throw new Error("Failed to fetch activity");
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching activity:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh every 10 seconds
  useEffect(() => {
    fetchAllActivity();
    const interval = setInterval(fetchAllActivity, 10000);
    // return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading logs...</div>;



  // Group logs by user
  const groupedLogs = {};
  for (const log of logs) {
    if (!groupedLogs[log.user_id]) {
      groupedLogs[log.user_id] = [];
    }
    groupedLogs[log.user_id].push(log);
  }



  return (
    <div className='w-full min-h-screen px-4 sm:px-8 lg:px-16 mt-5'>
      <h1>User Logs</h1>
      <br />
      {Object.keys(groupedLogs).length === 0 ? (
        <p>No activity found.</p>
      ) : (
        Object.entries(groupedLogs).map(([userId, userLogs]) => (
          <div key={userId} style={{ marginBottom: "20px", border:"2px solid black", padding:"10px", borderRadius:"20px" }}>
            <h3>User: {userId}</h3>
            <br></br>
            <div style={{ display: "flex", justifyContent:"space-around", flexDirection:"row-reverse", gap: "10px", flexWrap: "wrap" }}>
              {userLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background:
                      log.stage.toLowerCase() === "completed"
                        ? "#d4edda"
                        : "#fff3cd",
                  }}
                >
                  <strong>{log.stage}</strong>
                  <br />
                  Table: {log.table_id}
                  <br />
                  {new Date(log.created_at).toLocaleTimeString()}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
