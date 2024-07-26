import axios from "axios";

export default function UserTable({
  users,
  deleteUser,
  handleEditClick,
  onCheckboxChange,
}) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      deleteUser(id);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-10 py-3 px-4 text-center text-sm font-medium text-gray-700">
                Select
              </th>
              <th className="w-10 py-3 px-4 text-center text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Phone
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Hobbies
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="w-10 py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    onChange={() => onCheckboxChange(user._id)}
                  />
                </td>
                <td className="w-10 py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.hobbies}</td>
                <td className="py-2 px-4 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
