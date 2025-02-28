import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FetchNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()
    const token = localStorage.getItem("authToken"); // Get auth token

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/getNotification`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch notifications");
                }

                setNotifications(result.data); // Set notifications state
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <p>Loading notifications...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications available</p>
            ) : (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification._id}>
                            <strong>{notification.title}</strong> - {notification.message}
                            <br />
                            <small>{new Date(notification.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
    <button type="button" onClick={()=>navigate('/master-dashboard')}>Back</button>
        </div>
    );
};

export default FetchNotifications;
