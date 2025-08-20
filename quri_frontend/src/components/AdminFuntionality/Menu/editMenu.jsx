import React, { useEffect, useReducer, useCallback, useState } from 'react';
import { X } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { editMenu, fetchMenu } from '../../../features/menu/menuSlice';
import { fetchCategories } from '../../../features/categories/categoriesSlice';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_FORM':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const EditMenu = ({ onClose, menuId, refreshMenus }) => {
  const dispatch = useDispatch();
  const { menu, loading, error } = useSelector((state) => state.menus);
  const { menus: categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.categories);

  const [form, dispatchForm] = useReducer(formReducer, {
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    availability: '',
  });
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    dispatch(fetchMenu(menuId));
    dispatch(fetchCategories());
  }, [dispatch, menuId]);

  useEffect(() => {
    if (menu) {
      const isFileUpload = menu.Image && menu.Image.startsWith('food-uploads/');
      setUseFileUpload(isFileUpload);
      setSelectedImage(null); // Do not pre-set selectedImage to menu.Image

      dispatchForm({
        type: 'SET_FORM',
        payload: {
          name: menu.ItemName,
          price: menu.Price,
          description: menu.ItemDescription,
          imageUrl: isFileUpload ? '' : menu.Image,
          category: menu.CategoryID,
          availability: menu.MenuStatus,
        },
      });
    }
  }, [menu]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatchForm({ type: 'SET_FIELD', field: name, value });
    setApiError(null); // Clear API error on input change
  }, []);

  const handleFileChange = useCallback((e) => {
    setSelectedImage(e.target.files[0]);
    setApiError(null); // Clear API error on file change
  }, []);



  // const handleSave = useCallback(async () => {
  //   try {
  //     // Validate image input
  //     if (!useFileUpload && !form.imageUrl.trim()) {
  //       setApiError("Please provide an image URL.");
  //       return;
  //     }
  //     if (useFileUpload && !selectedImage) {
  //       setApiError("Please upload an image file.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append('ItemName', form.name);
  //     formData.append('ItemDescription', form.description);
  //     formData.append('Price', form.price);
  //     formData.append('CategoryID', form.category);
  //     formData.append('MenuStatus', form.availability);

  //     if (useFileUpload) {
  //       formData.append('image', selectedImage);
  //     } else {
  //       formData.append('Image', form.imageUrl);
  //     }

  //     await dispatch(editMenu({ menuId, formData })).unwrap();
  //     setApiError(null);
  //     onClose();
  //     refreshMenus?.();
  //   } catch (error) {
  //     console.error('Error updating menu item:', error);
  //     if (error.status === 408) {
  //       setApiError("Upload Image or Paste Image URL");
  //     }
  //   }
  // }, [dispatch, form, selectedImage, useFileUpload, menuId, onClose, refreshMenus]);





const handleSave = useCallback(async () => {
  try {

    setApiError(null);


    const formData = new FormData();
    formData.append('ItemName', form.name);
    formData.append('ItemDescription', form.description);
    formData.append('Price', form.price);
    formData.append('CategoryID', form.category);
    formData.append('MenuStatus', form.availability);

   
    if (useFileUpload && selectedImage) {
      formData.append('image', selectedImage);
    } else {
      formData.append('Image', form.imageUrl.trim()); 
    }

   

    await dispatch(editMenu({ menuId, formData })).unwrap();
    setApiError(null);
    onClose();
    refreshMenus?.();
  } catch (error) {
    console.error('Error updating menu item:', error);
    setApiError(error.message || 'Failed to update menu item');
  }
}, [dispatch, form, selectedImage, useFileUpload, menuId, onClose, refreshMenus]);




  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
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
        {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
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
            <div className="mb-4 text-black">
              <label className="block mb-2 font-medium text-black">Image</label>
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="imageOption"
                    value="url"
                    checked={!useFileUpload}
                    onChange={() => {
                      setUseFileUpload(false);
                      setSelectedImage(null);
                      setApiError(null);
                    }}
                  />
                  <span className="ml-2">Use Image URL</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="radio"
                    name="imageOption"
                    value="file"
                    checked={useFileUpload}
                    onChange={() => {
                      setUseFileUpload(true);
                      dispatchForm({ type: 'SET_FIELD', field: 'imageUrl', value: '' });
                      setSelectedImage(null); // Clear selectedImage on switch to file mode
                      setApiError(null);
                    }}
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
                  {selectedImage && (
                    <p className="text-sm mt-1">Selected File: {selectedImage.name}</p>
                  )}
                  {/* {!selectedImage && menu.Image && menu.Image.startsWith('food-uploads/') && (
                    <p className="text-sm mt-1">Current File: {menu.Image.split('/').pop()}</p>
                  )} */}
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