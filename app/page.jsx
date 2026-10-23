
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Bikes');
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/products', {
        name,
        image,
        price: Number(price),
        category,
      });

      setProducts((prev) => [...prev, data]);

      setName('');
      setImage('');
      setPrice('');
    } catch (error) {
      console.error(error);
      alert('Product qo‘shilmadi!');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Haqiqatan ham o‘chirmoqchimisiz?')) return;

    try {
      await axios.delete('/api/products', {
        data: { id },
      });

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert('Product o‘chirilmadi!');
    }
  };

  const editProduct = async (product) => {
    const newName = prompt('Yangi nom:', product.name);
    if (newName === null || !newName.trim()) return;

    const newPrice = prompt('Yangi narx ($):', product.price);
    if (newPrice === null || newPrice.trim() === '') return;

    if (!Number.isFinite(Number(newPrice)) || Number(newPrice) <= 0) {
      alert('Narx musbat son bo‘lishi kerak!');
      return;
    }

    try {
      const { data } = await axios.patch('/api/products', {
        id: product.id,
        name: newName.trim(),
        price: Number(newPrice),
      });

      setProducts((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
    } catch (error) {
      console.error(error);
      alert('Product tahrirlanmadi!');
    }
  };

  return (
    <main className="shop">
      <nav className="shop-nav">
        <a href="/" className="shop-logo">
          SPORT<span>ZONE</span>
        </a>
        <a href="#products">Products</a>
      </nav>

      <section className="shop-hero">
        <p className="eyebrow">MOVE YOUR WAY</p>
        <h1>Ready. Set. <span>Ride.</span></h1>
        <p>
          Bikes, scooters and skateboards for your next adventure.
        </p>
        <a href="#products" className="hero-btn">
          Explore Products ↓
        </a>
      </section>

      <section className="add-section">
        <h2>Add New Product</h2>

        <form className="product-form" onSubmit={addProduct}>
          <input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="url"
            placeholder="Product image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />

          <input
            type="number"
            min="1"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Bikes">Bikes</option>
            <option value="Scooters">Scooters</option>
            <option value="Skateboards">Skateboards</option>
          </select>

          <button type="submit">+ Add Product</button>
        </form>
      </section>

      <section className="products-section" id="products">
        <div className="products-heading">
          <div>
            <p className="eyebrow">OUR COLLECTION</p>
            <h2>Sports Equipment</h2>
          </div>
          <span>{products.length} products</span>
        </div>

        {loading ? (
          <p className="shop-message">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="shop-message">No products yet.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="product-info">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  <p className="product-price">
                    ${Number(product.price).toLocaleString('en-US')}
                  </p>

                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="shop-footer">
        © 2026 SPORTZONE — Keep Moving.
      </footer>
    </main>
  );
};

export default Home;
