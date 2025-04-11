import { useState, useEffect } from 'react';
import axios from 'axios';
import TextInput from '@/Components/MyTextInput';

const AddProducts = () => {
  const [ProductName, setProductName] = useState('');
  const [ProductImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ProductColor, setProductColor] = useState('#ffffff');
  const [SectionId, setSectionId] = useState(''); 
  const [sections, setSections] = useState([]); 
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [unit, setUnit] = useState('pcs'); 
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState(''); // New state for stock value

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const unitOptions = [
    { label: 'Piece(Pcs)', value: 'pcs' },
    { label: 'Kilogram(Kg)', value: 'kg' },
    { label: 'Gram(g)', value: 'g' },
  ];

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get('/api/sections');
        setSections(response.data);
      } catch (error) {
        console.error('Error fetching sections', error);
      }
    };

    fetchSections();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, ProductImage: 'Only image files are allowed.' }));
        setProductImage(null);
        setImagePreview(null);
        return;
      }
      setProductImage(file);
      setErrors((prev) => ({ ...prev, ProductImage: '' }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors before submitting
    setErrors({});

    const formData = new FormData();
    formData.append('name', ProductName);
    formData.append('color_bg', ProductColor);
    formData.append('section_id', SectionId);
    formData.append('price', productPrice);
    formData.append('stock', productStock);
    formData.append('unit', unit);
    formData.append('quantity_sold', 0); 

    if (ProductImage) {
        console.log('Image being sent:', ProductImage);
        formData.append('image', ProductImage);
    } else {
        console.log('No image selected');
    }

    try {
        const response = await axios.post('/api/AddProducts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Product added:', response.data);
        setSuccessMessage('Product added successfully!');

        setProductName('');
        setProductColor('#ffffff');
        setSectionId('');
        setProductPrice('');
        setProductStock('');
        setUnit('pcs');
        setProductImage(null);
        setImagePreview(null);
    } catch (error) {
        console.error('Error submitting the form', error);
        if (error.response && error.response.data.errors) {
            setErrors(error.response.data.errors);
        }
    }
};


  
  

  return (
    <div className="page-content">
      <div className="add-Product">
        <h1 className="title">Add Product</h1>
        <form className="Product-form" onSubmit={handleSubmit}>
      
          {/*  Product Name */}
          <div className="row-group"> 
            <TextInput
              label="Product Name"
              placeholder="Enter Product name"
              value={ProductName}
              onChange={(e) => setProductName(e.target.value)}
            />
            {errors.ProductName && <div className="error-message">{errors.ProductName}</div>}
         

          {/*  Section Dropdown */}
          <div className="input-group">
            <label className="input-label">Section</label>
            <select
              value={SectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="custom-input"
            >
              <option value="">Select a section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
            {errors.SectionId && <div className="error-message">{errors.SectionId}</div>}
          </div> 
          </div>
          <div className="row-group">
          {/* Product Image */}
          <div className="input-group">
            <label className="input-label">Product Image</label>
            <input
              type="file"
              className="custom-input"
              onChange={handleImageChange}
              accept="image/*"
            />
            {errors.ProductImage && <div className="error-message">{errors.ProductImage}</div>}
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Selected" />
            </div>
          )}</div>
          <div className="row-group"> 

          {/*  Product Color */}
          <div className="input-group">
            <TextInput
              label="Product Color"
              type="color"
              value={ProductColor}
              onChange={(e) => setProductColor(e.target.value)}
              style={{ height: '50px' }}
            />
          </div>

          
       {/*  Unit of Measurement */}
<div className="input-group">
  <label className="input-label">Unit of Measurement</label>
  {unitOptions.map((option) => (
    <div key={option.value}>
      <input
        type="radio"
        name="unit"
        value={option.value}
        checked={unit === option.value}
        onChange={handleUnitChange}
      />
      <label>{option.label}</label>
    </div>
  ))}
  {errors.unit && <div className="error-message">{errors.unit}</div>}
</div>

</div>
<div className="row-group"> 

          {/*  Product Price */}
          <div className="input-group">
            <TextInput
              label="Product Price"
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              step="0.01" 
              min="1" 
              style={{ width: '150px' }} 
            />
            {errors.productPrice && <div className="error-message">{errors.productPrice}</div>}
          </div>

          {/*  Product Stock */}
          <div className="input-group">
            <TextInput
              label="Product Stock"
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
              min="1"
              style={{ width: '150px' }}
            />
            {errors.productStock && <div className="error-message">{errors.productStock}</div>}
          </div>
</div>
          {/*  Submit Button */}
          <button type="submit" className="product-btn submit-btn">Create Product</button>
        </form>

        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
    </div>
  );
};

export default AddProducts;
