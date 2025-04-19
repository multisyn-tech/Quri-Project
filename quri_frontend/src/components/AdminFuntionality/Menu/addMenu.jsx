import React, { useReducer, useCallback, useEffect, useState } from 'react';
import { X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { addMenu } from '../../../features/menu/menuSlice';
import { fetchCategories } from '../../../features/categories/categoriesSlice';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    default:
      return state;
  }
};

const AddMenu = ({ onClose }) => {
  const dispatch = useDispatch();
  const { menus: categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [form, dispatchForm] = useReducer(formReducer, {
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    availability: ''
  });

  // Added state for image upload/file
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatchForm({ type: 'SET_FIELD', field: name, value });
  }, []);

  const handleFileChange = useCallback((e) => {
    setSelectedImage(e.target.files[0]);
  }, []);


  // const handleSave = useCallback(async () => {
  //   try {
  //     const newMenu = {
  //       ItemName: form.name,
  //       ItemDescription: form.description,
  //       Price: form.price,
  //       Image: form.imageUrl,
  //       CategoryID: form.category,
  //       MenuStatus: form.availability,
  //     };

  //     await dispatch(addMenu(newMenu)).unwrap();
  //     onClose();
  //   } catch (error) {
  //     console.error('Error adding menu item:', error);
  //   }
  // }, [dispatch, form, onClose]);

  const handleSave = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('ItemName', form.name);
      formData.append('ItemDescription', form.description);
      formData.append('Price', form.price);
      formData.append('CategoryID', form.category);
      formData.append('MenuStatus', form.availability);

      // Check if user is uploading a file or providing a URL
      if (useFileUpload) {
        if (selectedImage) {
          formData.append('image', selectedImage);
        } else {
          console.error('Please select an image to upload');
          return;
        }
      } else {
        formData.append('Image', form.imageUrl);
      }

      await dispatch(addMenu(formData)).unwrap();
      onClose();
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  }, [dispatch, form, selectedImage, useFileUpload, onClose]);


  useEffect(() => {
    // Prevent body scroll when the modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      // Re-enable body scroll when the modal is closed
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg h-full overflow-y-auto relative">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-bold text-black">Add Menu</h2>
          <button onClick={onClose} className="hover:bg-gray-300 rounded-full p-1 text-black">
            <X size={20} />
          </button>
        </div>
        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <div className="mb-4 text-black">
              <label className="block mb-2 font-medium text-black">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="name"
                value={form.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4 text-black">
              <label className="block mb-2 font-medium text-black">Price</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div className="mb-4 text-black">
              <label className="block mb-2 font-medium text-black">Ingredients</label>
              <textarea
                className="w-full p-2 border rounded"
                name="description"
                value={form.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Option to choose between URL and File upload */}
            <div className="mb-4 text-black">
              <label className="block mb-2 font-medium text-black">Image</label>
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="imageOption"
                    value="url"
                    checked={!useFileUpload}
                    onChange={() => setUseFileUpload(false)}
                  />
                  <span className="ml-2">Use Image URL</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="radio"
                    name="imageOption"
                    value="file"
                    checked={useFileUpload}
                    onChange={() => setUseFileUpload(true)}
                  />
                  <span className="ml-2">Upload Image File</span>
                </label>
              </div>

              {useFileUpload ? (
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border rounded"
                  onChange={handleFileChange}
                />
              ) : (
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                />
              )}
            </div>

            <div className="mb-4 text-black">
              <label className="block mb-2 font-medium text-black">Category</label>
              <select
                className="w-full p-2 border rounded"
                name="category"
                value={form.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.CategoryID} value={category.CategoryID}>
                    {category.CategoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 text-black">
              <label className="block mb-2 font-medium text-black">Availability</label>
              <select
                className="w-full p-2 border rounded"
                name="availability"
                value={form.availability}
                onChange={handleInputChange}
              >
                <option value="">Select Availability</option>
                <option value="active">Active</option> {/* Set to "active" */}
                <option value="inactive">Inactive</option> {/* Set to "inactive" */}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddMenu;
