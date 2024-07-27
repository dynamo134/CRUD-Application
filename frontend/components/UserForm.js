import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
        toast.success("User updated successfully!"); // Show success toast
      } else {
        // Create a new user
        const res = await axios.post("/api/users", formData);
        toast.success("User added successfully!"); // Show success toast
        console.log("save user:",res);
      }
      toggleModal(); // Close the modal after saving user
      fetchUsers(); // Refresh the user list
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save user. Please try again.";
      toast.error(errorMessage); // Show error toast with message from the server or default message
      console.error("Failed to save user:", error.message);
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
        required
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="block border mb-2 p-2 w-full"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="block border mb-2 p-2 w-full"
        required
      />
      <input
        name="hobbies"
        value={formData.hobbies}
        onChange={handleChange}
        placeholder="Hobbies"
        className="block border mb-2 p-2 w-full"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {user ? "Update" : "Save"} {/* Conditionally render button text */}
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 ml-2  rounded"
        onClick={toggleModal}
      >
        Cancel
      </button>
    </form>
  );
}
