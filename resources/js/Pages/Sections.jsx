import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import TextInput from '@/Components/MyTextInput';

const Sections = () => {
  const [sectionName, setSectionName] = useState('');
  const [sectionImage, setSectionImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [sections, setSections] = useState([]); // State for all sections

  // Fetch sections when the component mounts
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get('/api/sections');
        setSections(response.data); // Store the fetched sections in state
      } catch (error) {
        console.error('Error fetching sections', error);
      }
    };

    fetchSections();
  }, []); // Empty dependency array to run only on mount

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, sectionImage: 'Only image files are allowed.' }));
        setSectionImage(null);
        setImagePreview(null);
        return;
      }

      setSectionImage(file);
      setErrors((prev) => ({ ...prev, sectionImage: '' }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {};

    // Validate section name
    if (!sectionName.trim()) {
      newErrors.sectionName = 'Section name is required.';
      valid = false;
    }

    // Validate section image
    if (!sectionImage) {
      newErrors.sectionImage = 'Section image is required.';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const formData = new FormData();
      formData.append('name', sectionName);
      formData.append('image', sectionImage);

      try {
        const response = await axios.post('/api/sections', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Form submitted successfully!', response.data);
        setSuccessMessage('Section created successfully!');

        // Clear the form and refresh the section list
        setSectionName('');
        setSectionImage(null);
        setImagePreview(null);

        // Re-fetch sections after adding a new one
        const updatedSections = await axios.get('/api/sections');
        setSections(updatedSections.data);

      } catch (error) {
        console.error('Error submitting the form', error);
        if (error.response) {
          setErrors(error.response.data.errors || {});
        }
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/sections/${id}`);
      setSections(sections.filter(section => section.id !== id)); // Remove deleted section
    } catch (error) {
      console.error('Error deleting section', error);
    }
  };

  return (
    <div className="page-content">
      <div className="add-section">
        <h1 className="title">Add Section</h1>
        <form className="section-form" onSubmit={handleSubmit}>
          <TextInput
            label="Section Name"
            placeholder="Enter section name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
          {errors.sectionName && <div className="error-message">{errors.sectionName}</div>}

          <div className="row-group">
            <div className="input-group">
              <label className="input-label">Section Image</label>
              <input
                type="file"
                className="custom-input"
                onChange={handleImageChange}
                accept="image/*"
              />
              {errors.sectionImage && <div className="error-message">{errors.sectionImage}</div>}
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Selected" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn">Create Section</button>
        </form>

        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>

      <div className="all-sections">
        <h1 className="title">All Sections</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              {/* <th>Edit</th> */}
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id}>
                <td>{section.name}</td>
                <td>
                <img src={`/storage/${section.image}`} alt={section.name} width="100" />
                </td>
                {/* <td>
                   <button>
                   <img src="/images/icon/edit.svg" alt="Edit" width="20" />
                  </button>
                </td> */}
                <td>
                  <button onClick={() => handleDelete(section.id)}>
                    <img src="/images/icon/delete.svg" alt="Delete" width="20" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sections;
