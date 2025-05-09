import React, { useEffect, useState } from "react";
import api from "../services/api"; // Đảm bảo đường dẫn đúng tới file api.js
import './styles/ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    brand_name: '',
    discount: '',
    images: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("http://localhost:8080/testapi/products.php");
        const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle adding new product
  const handleAddProduct = async () => {
    try {
      const response = await api.post("http://localhost:8080/testapi/add_product.php", newProduct);
      setProducts([...products, response.data]); // Update product list with new product
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category_id: '',
        brand_id: '',
        discount: '',
        image_url: ''
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle editing product
  const handleEditProduct = async () => {
    try {
      // Kiểm tra dữ liệu sẽ được gửi
      console.log("Data sent to API:", editingProduct);  // Kiểm tra dữ liệu gửi đi
  
      const response = await api.post("http://localhost:8080/testapi/edit_product.php", editingProduct);
      
      console.log("API Response:", response.data);  // Kiểm tra phản hồi từ API
  
      if (response.data.error) {
        console.error("API Error:", response.data.error);
      } else {
        setProducts(products.map(product => product.id === editingProduct.id ? response.data : product)); // Cập nhật danh sách sản phẩm
        setEditingProduct(null); // Xóa dữ liệu chỉnh sửa
        setShowModal(false); // Đóng modal
      }
    } catch (error) {
      console.error("Error updating product:", error);  // In ra lỗi nếu có
    }
  };
  
  

  // Handle deleting product
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (!confirmDelete) {
      return; // Nếu người dùng nhấn Cancel, không làm gì cả
    }
  
    try {
      const response = await api.get(`http://localhost:8080/testapi/delete_product.php?id=${productId}`);
      console.log("Xóa phản hồi:", response.data);
  
      if (response.data.message) {
        setProducts(products.filter(product => product.id !== productId));
        alert("Sản phẩm đã được xóa thành công!");
      } else {
        alert("Không thể xóa sản phẩm: " + (response.data.error || "Không rõ lý do"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Xảy ra lỗi khi xóa sản phẩm.");
    }
  };
  
  

  // Open modal for editing a product
  const openModalForEdit = (product) => {
    setEditingProduct({ ...product });
    setShowModal(true);
  };

  // Open modal for adding a new product
  const openModalForAdd = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category_id: '',
      brand_name: '',
      discount: '',
      images: ''
    });
    setEditingProduct(null); // Reset for add mode
    setShowModal(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category_id: '',
      brand_name: '',
      discount: '',
      images: ''
    });
  };

  return (
    <div className="product-list">
      <h2 className="title">Danh sách sản phẩm</h2>
      <button className="btn add-btn" onClick={openModalForAdd}>Thêm sản phẩm</button>

      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá gốc</th>
              <th>Giá khuyến mãi</th>
              <th>Mô tả</th>
              <th>Thể loại</th>
              <th>Thương hiệu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="8">Không có sản phẩm</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.images && product.images.split(",")[0] ? product.images.split(",")[0] : 'default-image-url.jpg'}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td><del>{product.price}</del></td>
                  <td><strong>{product.discount}</strong></td>
                  <td>{product.description}</td>
                  <td>{product.category_name}</td>
                  <td>{product.brand_name}</td>
                  <td>
                    <button className="btn edit-btn" onClick={() => openModalForEdit(product)}>Sửa</button>
                    <button className="btn delete-btn" onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Product */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Tên sản phẩm"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })) }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Mô tả sản phẩm"
                value={editingProduct ? editingProduct.description : newProduct.description}
                onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value })) }
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Giá gốc"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, price: e.target.value }) : setNewProduct({ ...newProduct, price: e.target.value })) }
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Giá khuyến mãi"
                value={editingProduct ? editingProduct.discount : newProduct.discount}
                onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, discount: e.target.value }) : setNewProduct({ ...newProduct, discount: e.target.value })) }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Mã thể loại"
                value={editingProduct ? editingProduct.category_id : newProduct.category_id}
                onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, category_id: e.target.value }) : setNewProduct({ ...newProduct, category_id: e.target.value })) }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Tên thương hiệu"
                value={editingProduct ? editingProduct.brand_name : newProduct.brand_name}
                onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, brand_name: e.target.value }) : setNewProduct({ ...newProduct, brand_name: e.target.value })) }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="URL hình ảnh"
                value={editingProduct ? editingProduct.images : newProduct.images}
                onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, images: e.target.value }) : setNewProduct({ ...newProduct, images: e.target.value })) }
              />
            </div>
            <div className="button-group">
              <button className="btn update-btn" onClick={editingProduct ? handleEditProduct : handleAddProduct}>
                {editingProduct ? "Cập nhật" : "Thêm sản phẩm"}
              </button>
              <button className="btn cancel-btn" onClick={closeModal}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;