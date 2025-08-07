import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("authToken")
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/viewNotification`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong");
                }

                setNotifications(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <p>Loading notifications...</p>;
    if (error) return <p>Error: {error}</p>;

//     return (
//         <div className="container">
//   <h2>Admin Notifications</h2>
//   {notifications.length === 0 ? (
//     <p>No notifications found.</p>
//   ) : (
//     <div className="flex-wrap">
//       {notifications.map((notification) => (
//         <div key={notification._id} className="card">
//           <h4>{notification.title}</h4>
//           <p><strong>Message:</strong> {notification.message}</p>
//           <p><strong>Type:</strong> {notification.type}</p>

//         </div>
//       ))}
//     </div>
//   )}
// </div>
//     );
// };

  return (
    <div className="container">
      <h2>Admin Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div className="flex-wrap">
          {notifications.map((notification) => {
            const {
              _id,
              title,
              message,
              type,
              forRoles,
              dojoId,
            } = notification;

            const dojoAddress = dojoId?.address
              ? `${dojoId.address.place}, ${dojoId.address.city}, ${dojoId.address.state} - ${dojoId.address.pincode}`
              : "N/A";

            return (
              <div key={_id} className="card">
                <h4>{title}</h4>
                <p><strong>Message:</strong> {message}</p>
                <p><strong>Type:</strong> {type}</p>
                <p><strong>Notification For:</strong> {forRoles?.join(", ")}</p>
                <p><strong>Dojo Address:</strong> {dojoAddress}</p>
              </div>
            );
          })}
        </div>
      )}
      <button className="button grey" onClick={() => navigate(`/admin-dashboard`)}>Back</button>

    </div>
  );
};

export default AdminNotification;
