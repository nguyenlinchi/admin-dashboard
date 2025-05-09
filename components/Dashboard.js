import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import './styles/Dashboard.css';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cart, setCart] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Đổi đường link thành full URL cho products
        const productsRes = await api.get("http://localhost:8080/testapi/products.php");
        console.log("Products:", productsRes.data);
        setProducts(productsRes.data || []);

        const brandsRes = await api.get("/get_categories.php");
        setBrands(brandsRes.data || []);

        const cartRes = await api.get("/cart.php");
        setCart(cartRes.data || []);

        // Lấy dữ liệu người dùng
        const usersData = await api.get("/user.php");
        setUsers(usersData.data || []); // Cập nhật mảng người dùng từ API

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Chạy một lần khi component mount

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>

      <div className="stats">
        <div className="card red">
          <h3><Link to="/products">Products</Link></h3>
          <p>{products.length} Products</p>
        </div>
        <div className="card blue">
          <h3><Link to="/brands">Brands</Link></h3>
          <p>{brands.length} Brands</p>
        </div>
        <div className="card green">
          <h3><Link to="/users">Users</Link></h3>
          <p>{users.length} Users</p> {/* Hiển thị số lượng người dùng */}
        </div>
        <div className="card orange">
          <h3><Link to="/orders">Orders</Link></h3>
          <p>{cart.length} Orders</p>
        </div>
      </div>

      <div className="overview">
        <h3>Product Overview</h3>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Brand</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const imageUrl = product.images?.split(',')[0];

              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd"
                        }}
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category_name || "N/A"}</td>
                  <td>${product.price}</td>
                  <td>{product.brand_name || "N/A"}</td>
                  <td>{product.orderStatus || "Pending"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
