import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/UserList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', level: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:8080/testapi/get_user.php')
      .then(response => {
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setError(response.data.message);
        }
      })
      .catch(err => {
        setError('Error fetching data: ' + err.message);
      });
  };

  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    setCurrentUser(user);
    setFormData({ name: user.name, email: user.email, level: user.level });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa user này không?")) {
      axios.post('http://localhost:8080/testapi/delete_user.php', { id })
        .then(response => {
          if (response.data.success) {
            fetchUsers();
          } else {
            alert(response.data.message);
          }
        })
        .catch(err => alert('Lỗi xóa: ' + err.message));
    }
  };

  const handleAdd = () => {
    setCurrentUser(null);
    setFormData({ name: '', email: '', level: '' });
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    const url = currentUser ? 'http://localhost:8080/testapi/update_user.php' : 'http://localhost:8080/testapi/add_user.php';
    const data = { ...formData };
    if (currentUser) data.id = currentUser.id;

    axios.post(url, data)
      .then(response => {
        if (response.data.success) {
          fetchUsers();
          setIsModalVisible(false);
        } else {
          alert(response.data.message);
        }
      })
      .catch(err => alert('Lỗi: ' + err.message));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="wrapper-center">
      <div className="user-list-container">
        <div className="header-actions">
          <h1>User List</h1>
          <button className="btn add-btn" onClick={handleAdd}>+ Thêm mới</button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {users.length > 0 ? (
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Cấp độ</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.level}</td>
                    <td>
                      <button className="btn edit-btn" onClick={() => handleEdit(user.id)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn delete-btn" onClick={() => handleDelete(user.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-users">Không có người dùng.</p>
        )}
      </div>

      {/* Modal for Add/Edit User */}
      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>{currentUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Tên:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Cấp độ:</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div>
                <button type="submit">{currentUser ? 'Cập nhật' : 'Thêm'}</button>
                <button type="button" onClick={() => setIsModalVisible(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
