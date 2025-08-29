import React, { useEffect, useReducer, useCallback, useState } from 'react';
import { X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { editMenu, fetchMenu } from '../../../features/menu/menuSlice';
import { fetchCategories } from '../../../features/categories/categoriesSlice';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'SET_FORM':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

const EditMenu = ({ onClose, menuId, refreshMenus }) => {
  const dispatch = useDispatch();
  const { menu, loading, error } = useSelector((state) => state.menus);
  const { menus: categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchMenu(menuId));
    dispatch(fetchCategories());
  }, [dispatch, menuId]);

  const [form, dispatchForm] = useReducer(formReducer, {
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    availability: '',

  });

  // Added state for image upload/file
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    if (menu) {
      // Determine if the image is a file upload or a URL based on its path
      const isFileUpload = menu.Image && menu.Image.startsWith('food-uploads/');
      setUseFileUpload(isFileUpload); // Set file upload state based on the image source

      if (isFileUpload) {
        // If it's a file upload, set the selected image to the file path
        const fileName = menu.Image.split('/').pop(); // Get the file name from the path
        setSelectedImage(fileName); // Set the selected image file name
      }

      dispatchForm({
        type: 'SET_FORM',
        payload: {
          name: menu.ItemName,
          price: menu.Price,
          description: menu.ItemDescription,
          imageUrl: isFileUpload ? '' : menu.Image, // Clear imageUrl if it's a file
          category: menu.CategoryID,
          availability: menu.MenuStatus,
        },
      });
    }
  }, [menu]);



  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatchForm({ type: 'SET_FIELD', field: name, value });
  }, []);

  const handleFileChange = useCallback((e) => {
    setSelectedImage(e.target.files[0]);
  }, []);


  // const handleSave = useCallback(async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('ItemName', form.name);
  //     formData.append('ItemDescription', form.description);
  //     formData.append('Price', form.price);
  //     formData.append('CategoryID', form.category);
  //     formData.append('MenuStatus', form.availability);

  //     // Check if the user has chosen to upload a file or use the existing image
  //     if (useFileUpload) {
  //       if (selectedImage) {
  //         // If the user has selected a new file, append it
  //         formData.append('image', selectedImage);
  //       } else if (menu.Image) {
  //         // If no new file is selected, append the current file name (existing image)
  //         formData.append('image', menu.Image);
  //       } else {
  //         throw new Error("Image is required either as a file or a URL.");
  //       }
  //     } else {
  //       // If the user is using an image URL
  //       if (form.imageUrl) {
  //         formData.append('Image', form.imageUrl);
  //       } else {
  //         throw new Error("Image is required either as a file or a URL.");
  //       }
  //     }

  //     console.log("Form Data before sending:", {
  //       name: form.name,
  //       description: form.description,
  //       price: form.price,
  //       category: form.category,
  //       availability: form.availability,
  //       selectedImage: selectedImage ? selectedImage.name : form.imageUrl,
  //     });

  //     await dispatch(editMenu({ menuId, formData })).unwrap();

  //     onClose();

  //     if (refreshMenus) {
  //       refreshMenus();
  //     }
  //   } catch (error) {
  //     console.error('Error updating menu item:', error);
  //   }
  // }, [dispatch, form, selectedImage, useFileUpload, menu, onClose, menuId, refreshMenus]);



  const handleSave = useCallback(async () => {
    try {
      // Check if an image is provided
      if (!useFileUpload && !form.imageUrl) {
        alert("Please provide an image URL.");
        return;
      }
      if (useFileUpload && !selectedImage && !menu.Image) {
        alert("Please upload an image file.");
        return;
      }

      const formData = new FormData();
      formData.append('ItemName', form.name);
      formData.append('ItemDescription', form.description);
      formData.append('Price', form.price);
      formData.append('CategoryID', form.category);
      formData.append('MenuStatus', form.availability);

      if (useFileUpload) {
        // Use the new file if uploaded, otherwise use the existing image
        formData.append('image', selectedImage || menu.Image);
      } else {
        formData.append('Image', form.imageUrl);
      }

      await dispatch(editMenu({ menuId, formData })).unwrap();
      onClose();
      refreshMenus?.();
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  }, [dispatch, form, selectedImage, useFileUpload, menu, onClose, menuId, refreshMenus]);



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
          <h2 className="text-lg font-bold text-black">Edit Menu</h2>
          <button onClick={onClose} className="hover:bg-gray-300 rounded-full p-1 text-black">
            <X size={20} />
          </button>
        </div>
        {(loading || categoriesLoading) && <p>Loading...</p>}
        {(error || categoriesError) && <p className="text-red-500">{error || categoriesError}</p>}
        {!loading && !categoriesLoading && (
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
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-2 border rounded"
                    onChange={handleFileChange}
                    required
                  />

                  {/* {selectedImage && (
                    typeof selectedImage === 'string' ? (
                      <p className="text-sm mt-1">Selected File: {selectedImage}</p>
                    ) : (
                      <p className="text-sm mt-1">Selected File: {selectedImage.name}</p>
                    )
                  )} */}

                  {/* If no new file is selected but there's an existing file */}
                  {!selectedImage && menu.Image && menu.Image.startsWith('food-uploads/') && (
                    <p className="text-sm mt-1">Current File: {menu.Image.split('/').pop()}</p>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleInputChange}
                  required
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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

export default EditMenu;
