import { useEffect, useState } from "react";
import axios from "axios";
import Modal from '@/Components/Modal';
import TextInput from '@/Components/MyTextInput';  // Import TextInput component

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [modalVisible, setModalVisible] = useState(false);  // Modal state
  const [editProduct, setEditProduct] = useState(null);  // State for editing product
  const [image, setImage] = useState(null);  // State for the new image

  useEffect(() => {
    // Fetch products
    axios.get("/api/products")
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch(error => console.error("Error fetching products:", error));

    // Fetch sections
    axios.get("/api/sections")
      .then(response => setSections(response.data))
      .catch(error => console.error("Error fetching sections:", error));
  }, []);

  // Filter products based on search and section
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSection) {
      filtered = filtered.filter(
        (product) => product.section_id === parseInt(selectedSection)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedSection, products]);

  const closeModal = () => {
    setModalVisible(false);
    setImage(null);  // Clear selected image when closing modal
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', editProduct.name);
    formData.append('price', editProduct.price);
    formData.append('stock', editProduct.stock);
    formData.append('unit', editProduct.unit);
    formData.append('section_id', editProduct.section_id);
  
    // Only append image if it's selected
    if (image) {
      formData.append('image', image);
    }
  
    // Update product on the server
    axios.put(`/api/products/${editProduct.id}`, formData)
      .then(response => {
        const updatedProduct = response.data.product;
        // Update the product list with the updated product
        setProducts(products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        ));
        closeModal();  // Close the modal after successful update
      })
      .catch(error => {
        console.error("Error updating product:", error);
      });
  };
  
  

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  return (
    <div className="page-content">
      <h1 className="title">Inventory</h1>


      <div className="row-group" style={{margin: "20px"}}>

  {/* Search Input */}
  <div style={{ position: "relative", width: "300px" }}>
    <input
      type="text"
      placeholder="Search product..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px 8px 40px",
        
        borderRadius: "4px",
        outline: "none",
      }}
    />
    {/* Search Icon */}
    <img
      src="/images/icon/search.svg"
      alt="Search"
      style={{
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "20px",
        height: "20px",
    
      }}
    />
  </div>

  {/* Section Filter with Icon */}
  <div style={{ position: "relative", width: "200px" }}>
    <select
      value={selectedSection}
      onChange={(e) => setSelectedSection(e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px 8px 40px", // Leave space for the icon
       
        borderRadius: "4px",
        outline: "none",
        appearance: "none", // Remove default arrow
      }}
    >
      <option value="">All Sections</option>
      {sections.map((section) => (
        <option key={section.id} value={section.id}>
          {section.name}
        </option>
      ))}
    </select>

    {/* Filter Icon */}
    <img
      src="/images/icon/filter.svg"
      alt="Filter"
      style={{
        position: "absolute",
        left: "10px", // Adjust positioning if needed
        top: "50%",
        transform: "translateY(-50%)",
        width: "20px",
        height: "20px",
      
        pointerEvents: "none", // Prevent clicking on the icon
      }}
    />
  </div>
</div>
    

      <Modal show={modalVisible} onClose={closeModal}>
        <div className="page-content">
          <h2 className="title">Edit Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="row-group">
              <TextInput
                type="text"
                label="Product Name"
                placeholder="Product Name"
                value={editProduct?.name || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
              <TextInput
                type="number"
                label="Price Per Unit"
                placeholder="Price"
                value={editProduct?.price || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
              />
            </div>

            <div className="row-group">
              <TextInput
                type="text"
                label="Unit"
                labelStyle={{color: "#333"}}
                placeholder="Unit"
                value={editProduct?.unit || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, unit: e.target.value })
                }
                disabled
                style={{backgroundColor: "#f5f5f5",color: "#333"}}
              />
              <TextInput
                type="number"
                label="Stock"
                placeholder="Stock"
                value={editProduct?.stock || ""}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, stock: e.target.value })
                }
              />
            </div>

            <div className="input-group row-group">
              <label className="input-label">Product Image</label>
              <input
                type="file"
                className="custom-input"
                onChange={handleImageChange}
              />
          <img
  src={editProduct?.image ? `/storage/products/${editProduct.image}` : null}
  alt={editProduct?.name}
  width="100"
/>


            </div>

            <div className="row-group">
              <button
                type="submit"
                className="submit-btn"
                style={{ backgroundColor: "darkgreen", marginTop: "10px" }}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="submit-btn product-btn"
                style={{ backgroundColor: "darkred" }}
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="row-group" style={{ margin: "20px" }}>
        {/* Table with filtered products */}
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price Per Unit</th>
            <th>Unit</th>
            <th>Stock</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <div>
                  <img
                    src={`/storage/${product.image}`}
                    alt={product.name}
                    width="50"
                    style={{
                      marginRight: "10px",
                      backgroundColor: product.color_bg || "transparent",
                    }}
                    onError={(e) => e.target.src = ''}
                  />
                  {product.name}
                </div>
              </td>
              <td>${product.price}</td>
              <td>{product.unit || "N/A"}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => { setEditProduct(product); setModalVisible(true); }}>
                  <img src="/images/icon/edit.svg" alt="Edit" width="20" />
                </button>
              </td>
              <td>
                <button>
                  <img src="/images/icon/delete.svg" alt="Delete" width="20" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
