import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

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


  const userIds = Object.keys(groupedLogs);
  const totalPages = Math.ceil(userIds.length / logsPerPage);

  const startIndex = (currentPage - 1) * logsPerPage;
  const currentUserIds = userIds.slice(startIndex, startIndex + logsPerPage);


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

            {["created", "confirmed", "checkout", "paid", "completed"].map((stage) => (
              <div key={stage} style={{ textAlign: "center", marginLeft: "10px", padding: "10px", borderRadius: "5px" }}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </div>
            ))}
          </div>

          {currentUserIds.map((userId) => {
            const userLogs = groupedLogs[userId];
            return (
              <div key={userId} style={{ marginBottom: "0px" }}>
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
                  {["created", "confirmed", "checkout", "paid", "completed"].map((stage) => {
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
                        {log ? "✔" : ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{ marginRight: "10px" }}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    backgroundColor: currentPage === page ? "#007BFF" : "#fff",
                    color: currentPage === page ? "white" : "black",
                    cursor: "pointer",
                  }}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ marginLeft: "10px" }}
            >
              Next
            </button>
          </div>



        </div>



      )}
    </div>
  );
}
