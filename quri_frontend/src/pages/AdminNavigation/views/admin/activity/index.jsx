import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all activity from backend
  const fetchAllActivity = async () => {
    try {
      const response = await fetch(`${BASE_URL}/customers/user_logs`);
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

        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto repeat(5, 1fr)",
              gridGap: "15px",
              backgroundColor: "#007BFF",
              padding: "10px",
              borderRadius: "10px",
              color: "white",
              fontWeight: "bold",
            }}
          >

            <div style={{ textAlign: "center", padding: "10px", marginLeft: "40px", borderRadius: "5px" }}>
              User ID
            </div>

            {['created', 'confirmed', 'checkout', 'paid', 'completed'].map((stage) => (
              <div key={stage} style={{ textAlign: "center", marginLeft: "10px", padding: "10px", borderRadius: "5px" }}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </div>
            ))}
          </div>

          {Object.entries(groupedLogs).map(([userId, userLogs]) => (
            <div key={userId} style={{ marginBottom: "30px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto repeat(5, 1fr)",
                  gridGap: "15px",
                  backgroundColor: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f1f1f1",
                    borderRadius: "5px",
                    fontSize: "0.85rem",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                  title={userId} 
                >
                  {userId.length > 15 ? `${userId.slice(0, 15)}...` : userId} 
                </div>

              
                {['created', 'confirmed', 'checkout', 'paid', 'completed'].map((stage) => {
                  const log = userLogs.find((log) => log.stage.toLowerCase() === stage);
                  return (
                    <div
                      key={stage}
                      style={{
                        textAlign: "center",
                        padding: "10px",
                        border: "1px solid #ddd",
                        backgroundColor: log ? "#d4edda" : "#fff3cd",
                        color: log ? "#155724" : "#856404",
                        borderRadius: "5px",
                      }}
                    >
                      {log ? '✔' : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>




      )}
    </div>
  );
}
