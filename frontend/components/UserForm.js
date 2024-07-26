import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/";

export default function UserForm({
  user,
  fetchUsers,
  toggleModal,
  updateUser,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    hobbies: "",
  });

  // Populate form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        hobbies: user.hobbies || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        // Update existing user
        await axios.put(`/api/users/${user._id}`, formData);
        updateUser({ ...user, ...formData }); // Update the user in the parent component
      } else {
        // Create a new user
        await axios.post("/api/users", formData);
      }
      toggleModal(); // Close the modal after saving user
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="block border mb-2 p-2 w-full"
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="block border mb-2 p-2 w-full"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="block border mb-2 p-2 w-full"
      />
      <input
        name="hobbies"
        value={formData.hobbies}
        onChange={handleChange}
        placeholder="Hobbies"
        className="block border mb-2 p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        {user ? "Update" : "Save"} {/* Conditionally render button text */}
      </button>
      <button
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded-md"
        onClick={toggleModal}
      >
        Cancel
      </button>
    </form>
  );
}
