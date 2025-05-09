import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Form, Input, Button } from 'antd'; // Import Ant Design components
import './styles/BrandList.css';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const [newBrand, setNewBrand] = useState({ name: '', image: '' });
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // For showing/hiding the modal
  const [form] = Form.useForm(); // Form instance to control inputs

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:8080/testapi/get_categories.php');
      setBrands(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch brands');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrand = async () => {
    const values = form.getFieldsValue(); // Get form data
    if (!values.name || !values.image) {
      alert('Please fill in both fields');
      return;
    }

    try {
      await axios.post('http://localhost:8080/testapi/get_categories.php', values);
      setIsModalVisible(false); // Close modal after successful add
      fetchBrands();
      form.resetFields(); // Clear form fields
    } catch (error) {
      alert('Failed to add brand');
    }
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    form.setFieldsValue({ name: brand.name, image: brand.image }); // Populate the form with the current brand data
    setIsModalVisible(true);
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await axios.delete('http://localhost:8080/testapi/get_categories.php', { data: { id } });
      fetchBrands();
    } catch (error) {
      alert('Failed to delete brand');
    }
  };

  const handleSubmit = () => {
    if (editingBrand) {
      handleUpdateBrand();
    } else {
      handleAddBrand();
    }
  };

  const handleUpdateBrand = async () => {
    const values = form.getFieldsValue();
    try {
      await axios.put('http://localhost:8080/testapi/get_categories.php', { ...editingBrand, ...values });
      setIsModalVisible(false); // Close modal after successful update
      fetchBrands();
      form.resetFields(); // Clear form fields
    } catch (error) {
      alert('Failed to update brand');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="wrapper-center">
      <div className="brand-list">
        <h1 className="brand-title">Danh sách Thương hiệu</h1>

        {/* Button to show modal for adding a new brand */}
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Thêm Thương hiệu
        </Button>

        {/* Table to display list of brands */}
        <div className="table-wrapper">
          <table className="brand-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id}>
                    <td>{brand.id}</td>
                    <td>{brand.name}</td>
                    <td>
                      <img src={brand.image} alt={brand.name} className="brand-image" />
                    </td>
                    <td>
                      <Button onClick={() => handleEditBrand(brand)}>Chỉnh sửa</Button>
                      <Button onClick={() => handleDeleteBrand(brand.id)} danger>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Không tìm thấy thương hiệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding or editing brands */}
      <Modal
        title={editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields(); // Reset form when modal is closed
        }}
        okText={editingBrand ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu' }]}
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>

          <Form.Item
            name="image"
            label="URL hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandList;
