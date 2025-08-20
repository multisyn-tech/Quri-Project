import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, Typography, Paper, Grid, Switch, FormControlLabel } from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import Pagination from './Pagination';
import AddMenu from './addMenu';
import EditMenu from './editMenu';
import { fetchMenus, deleteMenu } from '../../../features/menu/menuSlice';
import { editMenu, fetchMenu } from '../../../features/menu/menuSlice';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Index = () => {

  const dispatch = useDispatch();
  const menus = useSelector((state) => state.menus.menus);
  const loading = useSelector((state) => state.menus.loading);
  const error = useSelector((state) => state.menus.error);

  const [active, setActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = menus?.slice(indexOfFirstPost, indexOfLastPost);

  // console.log(menus);


  const openAddMenu = () => {
    setIsAddMenuOpen(true);
  };

  const closeAddMenu = () => {
    setIsAddMenuOpen(false);
    dispatch(fetchMenus());
  };

  const openEditMenu = (menuId) => {
    setSelectedMenuId(menuId);
    setIsEditMenuOpen(true);
  };

  const closeEditMenu = () => {
    setIsEditMenuOpen(false);
    setSelectedMenuId(null);
    dispatch(fetchMenus());
  };

  const handleDeleteMenu = (menuId) => {
    dispatch(deleteMenu(menuId));
  };

  const menuImageStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-500' : 'text-red-500';
  };



  const handleToggleStatus = async (menu) => {

    const newStatus = menu.MenuStatus === 'active' ? 'inactive' : 'active';


    const response = await axios.put(`${BASE_URL}/restaurant/menu/status/${menu.MenuID}`, {
      MenuStatus: newStatus
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        'Content-Type': 'application/json'
      },
    });

    dispatch(fetchMenus());


  };




  return (
    <>
      <div className="mt-10 ">
        <Grid container spacing={3} >
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              className="w-full dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={openAddMenu}
            >
              Add New Item
            </Button>
          </Grid>

          {loading && (
            <Grid item xs={12}>
              <Typography variant="body1" className="text-center dark:text-white">Loading...</Typography>
            </Grid>
          )}
          {error && (
            <Grid item xs={12}>
              <Typography variant="body1" className="text-center text-red-500 dark:text-red-400">
                Error: {error}
              </Typography>
            </Grid>
          )}

          {Array.isArray(currentPosts) && currentPosts.length > 0 ? (
            currentPosts.map((menu) => (
              <Grid item xs={10} sm={6} md={4} lg={3} key={menu.MenuID}>
                <Paper
                  className="p-4 dark:bg-gray-800 dark:text-gray-100 h-[100%]"
                  elevation={3}
                  style={{ transition: 'background-color 0.3s ease' }}
                >
                  <div className="menu-image-container mb-4">
                    {menu.Image && (
                      <>
                        {menu.Image.startsWith('food-uploads/') ? (
                          <img
                            src={`${BASE_URL}/${menu.Image}`}
                            alt={menu.ItemName}
                            style={menuImageStyle}
                          />
                        ) : (
                          <img
                            src={menu.Image}
                            alt={menu.ItemName}
                            style={menuImageStyle}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <Typography variant="h6" className="dark:text-gray-100">
                    Name: {menu.ItemName}
                  </Typography>
                  <Typography variant="body1" className="dark:text-gray-300">
                    Price: AED {menu.Price}
                  </Typography>
                  <Typography variant="body1" className="dark:text-gray-300">
                    Ingredients: {menu.ItemDescription}
                  </Typography>
                  <Typography variant="body1" className="dark:text-gray-300">
                    Category: {menu.CategoryName}
                  </Typography>
                  <Typography variant="body1" className={getStatusColor(menu.MenuStatus)}>
                    Menu Status: {menu.MenuStatus}
                  </Typography>
                  <div className="flex justify-between mt-4">
                    <IconButton
                      color="primary"
                      size="large"
                      className="hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full"
                      onClick={() => openEditMenu(menu.MenuID)}
                    >
                      <Edit fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="large"
                      className="hover:bg-red-100 dark:hover:bg-red-900 rounded-full"
                      onClick={() => handleDeleteMenu(menu.MenuID)}
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>


                    <FormControlLabel
                      control={
                        <Switch
                          checked={menu.MenuStatus === "active"}
                          onChange={() => handleToggleStatus(menu)}
                          color="success"
                        />
                      }
                      label={menu.MenuStatus === "active" ? "Active" : "Inactive"}
                    />


                  </div>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" align="center" className="dark:text-gray-400">
                No menu available.
              </Typography>
            </Grid>
          )}


          <Grid item xs={12}>
            <Pagination
              totalPosts={menus.length}
              postsPerPage={postsPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </Grid>

          {isAddMenuOpen && <AddMenu onClose={closeAddMenu} />}
          {isEditMenuOpen && <EditMenu onClose={closeEditMenu} menuId={selectedMenuId} />}
        </Grid>


      </div>
    </>
  );
};

export default Index;
