import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const { data } = await api.get('/products/sales');
      setSales(data);
    } catch (error) {
      // ignore
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/products', { name, description, price: Number(price), fileUrl });
      setProducts([data, ...products]);
      setShowForm(false);
      setName('');
      setDescription('');
      setPrice(0);
      setFileUrl('');
      toast.success('Product created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.amountPaid, 0);

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-400 text-sm">Sell digital products directly from your page</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl font-medium transition-colors">
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Total Sales</p>
          <p className="text-2xl font-bold text-blue-400">{sales.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Products</p>
          <p className="text-2xl font-bold text-primary-400">{products.length}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
          <h3 className="font-semibold">New Product</h3>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product name" required
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={2}
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 resize-none" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price (₹, 0 = free)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0"
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">File URL (Cloudinary/External)</label>
              <input type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-colors">Create</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {products.map(product => (
          <div key={product._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-400">{product.description || 'No description'}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${product.price === 0 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {product.price === 0 ? 'Free' : `₹${product.price}`}
              </span>
              <span className="text-sm text-gray-400">{product.totalSales} sales</span>
              <button onClick={() => deleteProduct(product._id)} className="text-gray-400 hover:text-red-400">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;