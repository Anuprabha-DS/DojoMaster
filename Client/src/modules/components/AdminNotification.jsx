import { useEffect, useState } from "react";

const AdminNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div>
            <h2>Admin Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications found.</p>
            ) : (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification._id}>
                            <p><strong>Title:</strong> {notification.title}</p>
                            <p><strong>Message:</strong> {notification.message}</p>
                            <p><strong>Created At:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminNotification;
