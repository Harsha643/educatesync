import React, { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [image, setImage] = useState({ imageName: "", image: null });
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  const baseUrl = "https://educatesync.onrender.com" || "http://localhost:4000";

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/gallery`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setImage({ ...image, [e.target.name]: e.target.files[0] });
    } else {
      setImage({ ...image, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('imageName', image.imageName);
    formData.append('image', image.image);

    try {
      setLoading(true);
      let response;
      if (editingId) {
        response = await fetch(`${baseUrl}/admin/gallery/${editingId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch(`${baseUrl}/admin/gallery`, {
          method: 'POST',
          body: formData
        });
      }

      if (!response.ok) throw new Error('Image upload/update failed');
      setImage({ imageName: "", image: null });
      setEditingId(null);
      await fetchImages();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (img) => {
    setImage({ imageName: img.imageName, image: null });
    setEditingId(img._id);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/gallery/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete image');
      await fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  return (
    <div className="gallery-container">
      <h1>Gallery</h1>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="imageName" 
          placeholder="Enter image name"
          value={image.imageName}
          onChange={handleChange}
          required
        />
        <input 
          type="file" 
          name="image"
          accept="image/*"
          onChange={handleChange}
          required={!editingId}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : editingId ? 'Update Image' : 'Upload Image'}
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setImage({ imageName: "", image: null });
            setEditingId(null);
          }}>
            Cancel Edit
          </button>
        )}
      </form>

      <div className="images-list">
        <h2>Gallery Images</h2>
        {loading && images.length === 0 ? (
          <p>Loading images...</p>
        ) : images.length === 0 ? (
          <p>No images found</p>
        ) : (
          <>
            <ul className="image-grid">
              {currentImages.map((img) => (
                <li key={img._id} className="gallery-item">
                  <h3>{img.imageName}</h3>
                  <img src={img.image} alt={img.imageName} width="200" />
                  <div className="actions">
                    <button onClick={() => handleEdit(img)}>Edit</button>
                    <button onClick={() => handleDelete(img._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                ⬅ Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Next ➡
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
