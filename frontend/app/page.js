"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { toast } from "react-toastify";

// axios.defaults.baseURL = "http://localhost:5000/";

axios.defaults.baseURL = "https://crud-application-if4d.onrender.com";  //deployment

export default function Home() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditingUser(null); // Reset editing state when modal is toggled
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const addUser = async (user) => {
    try {
      await axios.post("/api/users", user);
      fetchUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(`/api/users/${id}`);
      toast.success(res.data.message);
      // Update the state to remove the deleted user ID from selectedUserIds
      setSelectedUserIds((prevSelected) =>
        prevSelected.filter((userId) => userId !== id)
      );
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      await axios.put(`/api/users/${updatedUser._id}`, updatedUser);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);

  };

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
    fetchUsers();
  };

  const handleSendMail = async () => {
    try {
      const res = await axios.post("/api/users/send-mail", {
        userIds: selectedUserIds,
        to: "info@redpositive.in", // Send email to this address (you can change according requirement)
      });
      
      console.log(res);
      // Check if the response status is 200 (successful)
      if (res.status === 200) {
        toast.success("Email sent successfully!");
        console.log("Email sent successfully!");
      } else {
        // Handle other success statuses if necessary
        toast.error("Unexpected response status: " + res.status);
      }
      
    } catch (error) {
      // Check if the error response is available
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send email. Please try again later.");
      }
      console.error("Failed to send email:", error.response.data.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-6xl bg-blue-100 shadow-md rounded-lg p-6">
        <header className="w-full mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            CRUD Application
          </h1>
        </header>
        <button
          className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 border border-blue-700 ml-5 mt-5 rounded-md"
          onClick={toggleModal}
        >
          Add
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/3">
              <h2 className="text-xl font-bold mb-4">
                {editingUser ? "Edit User" : "Add User"}
              </h2>
              <UserForm
                user={editingUser}
                fetchUsers={fetchUsers}
                toggleModal={toggleModal}
                updateUser={updateUser} // Pass updateUser to UserForm
              />
            </div>
          </div>
        )}

        <UserTable
          users={users}
          updateUser={updateUser}
          deleteUser={deleteUser}
          handleEditClick={handleEditClick}
          onCheckboxChange={handleCheckboxChange} // Pass the checkbox handler
        />
        <h1 className="text-lg mx-4 mt-5 text-gray-800">
          Send the Selected User Info on email{" "}
          <span className="font-bold">info@redpositive.in</span> by click below
          button :
        </h1>
        <button
          className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 ml-5 mt-5 rounded-md"
          onClick={handleSendMail}
        >
          Send mail
        </button>
      </div>
    </div>
  );
}
