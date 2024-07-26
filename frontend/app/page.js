"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

axios.defaults.baseURL = "http://localhost:5000/";

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
      await axios.delete(`/api/users/${id}`);
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
  };

  const handleSendMail = async () => {
    try {
      await axios.post("/api/users/send-mail", {
        userIds: selectedUserIds,
        to: "shaharyaramu16@gmail.com", // Send email to this address
      });
      // Optionally show a success message
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  return (
    <div>
      <button
        className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 ml-10 mt-10 rounded-md"
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

      <button
        className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 ml-10 mt-10 rounded-md"
        onClick={handleSendMail}
      >
        Send mail
      </button>
    </div>
  );
}
