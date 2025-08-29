import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FaPlus } from 'react-icons/fa';
import { fetchCategories, addCategory, editCategory, deleteCategory } from '../../../../../features/categories/categoriesSlice';

const Categories = () => {
  const [category, setCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingCategory, setEditingCategory] = useState('');

  const dispatch = useDispatch();
  const { menus: categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (category.trim()) {
      dispatch(addCategory({ CategoryName: category })).then(() => {
        setCategory('');
        dispatch(fetchCategories());
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (editingIndex !== null) {
        handleUpdateCategory();
      } else {
        handleAddCategory();
      }
    } else if (event.key === 'Escape') {
      setEditingIndex(null);
      setEditingCategory('');
    }
  };

  const handleDeleteCategory = (CategoryID) => {
    dispatch(deleteCategory(CategoryID)).then(() => {
      dispatch(fetchCategories());
    });
  };

  const handleEditCategory = (index) => {
    setEditingIndex(index);
    setEditingCategory(categories[index].CategoryName);
  };

  const handleUpdateCategory = () => {
    const updatedCategory = categories[editingIndex];
    dispatch(editCategory({ CategoryID: updatedCategory.CategoryID, updatedCategoryData: { CategoryName: editingCategory } })).then(() => {
      setEditingIndex(null);
      setEditingCategory('');
      dispatch(fetchCategories());
    });
  };

  return (
    <div className='flex flex-col mt-5 items-center min-h-screen'>
      <div className='flex mb-6 space-x-10'>
        <TextField
          label='Category Name'
          variant='outlined'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={handleKeyPress}
          className='mr-4 dark:bg-gray-900 dark:bg-white'
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddCategory}
          startIcon={<FaPlus />}
          sx={{ fontWeight: 'bold', fontSize: '1rem'}}
        >
          Add
        </Button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <TableContainer component={Paper} className='dark:bg-gray-800 dark:text-white'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.25rem' }} className='font-bold dark:bg-gray-900 dark:text-white'>Category Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.25rem' }} align='right' className='font-bold dark:bg-gray-900 dark:text-white'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.CategoryID} className='dark:bg-gray-800'>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} className='dark:text-white'>
                  {editingIndex === index ? (
                    <TextField
                      value={editingCategory}
                      onChange={(e) => setEditingCategory(e.target.value)}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className='dark:bg-gray-900 dark:bg-white'
                    />
                  ) : (
                    category.CategoryName
                  )}
                </TableCell>
                <TableCell align='right' className='dark:text-white'>
                  {editingIndex === index ? (
                    <Button onClick={handleUpdateCategory} color='info' size="large">
                      Save
                    </Button>
                  ) : (
                    <>
                      <IconButton color='primary' className='mr-2' onClick={() => handleEditCategory(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color='error' onClick={() => handleDeleteCategory(category.CategoryID)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Categories;
