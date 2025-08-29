import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tabs, Badge, Image } from 'antd-mobile';
import { MdFilterList } from "react-icons/md";
import { LeftOutline } from 'antd-mobile-icons';
import cardImg from '../../../../assets/Food/Tent1.png';
import ItemModal from './ItemModal';
import { fetchMenuByTableID } from '../../../../features/menu/menuSlice';
import ViewOrderButton from './OrderButtons/ViewOrderButton';
import PlaceOrderButton from './OrderButtons/PlaceOrderButton';
import { MdArrowBack } from "react-icons/md";
import { PiDotsThreeOutline } from "react-icons/pi";
import FAQ from '../../../../components/BillingFuntionality/Dashboard/SideBarContent/FAQ';
import SideBarMenu from '../../../../components/BillingFuntionality/Dashboard/SideBarMenu';
import { useDrawer } from '../../../../state/drawerContext';
import getStatus from '../../../../components/utility/storeStage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MenuItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const qrcode = useSelector((state) => state.qrcode.qrCodeDetails.data?.QRCode);
  //console.log("QrCode: ",qrcode)

  const tableID = useSelector((state) => state.qrcode.qrCodeDetails.data?.TableID);
  // console.log("Table ID: ", tableID);

  const menu = useSelector((state) => state.menus.menu); // Get the entire menu object
  // console.log("Menu",menu);

  // const menuItems = menu ? menu.menuItems : [];
  const menuItems = Array.isArray(menu?.menuItems) ? menu.menuItems : [];


  // console.log('menu Items', menuItems)

  // const categories = [...new Set(menuItems.map(item => item.CategoryName))];
  const categories = [...new Set(menuItems.map(item => item?.CategoryName || ''))];


  const cartItems = useSelector((state) => state.orders.cartItems);

  // console.log("Cart Items",cartItems);


  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [selectedFilter, setSelectedFilter] = useState(''); // Track selected filter
  const [visible, setVisible] = useState(false); // Modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // Currently selected menu item


  const { isDrawerOpen, toggleDrawer } = useDrawer(true);

  useEffect(() => {
    if (tableID) {
      dispatch(fetchMenuByTableID(tableID));
    }
  }, [dispatch, tableID]);

  // Set the first category only when categories change and if no category is selected yet
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]); // Set the first category only once
    }
  }, [categories, selectedCategory]);



  const checkStatus = () => {
    const storedUserId = localStorage.getItem("user_id"); 
  
    const orderStatus = getStatus.getOrderStatus();

    if (storedUserId === orderStatus.userId) {
      const lastStage = orderStatus.stages[orderStatus.stages.length - 1];
      console.log("Last stage for user", storedUserId, ":", lastStage);
    } else {
      console.log("User ID in localStorage does not match the stored user ID.");
    }
  };

  // checkStatus();



  const handleCategoryChange = (key) => {
    setSelectedCategory(key); // Update selected category on tab change
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleMenuItemClick = (item) => {
    setSelectedItem(item); // Set the selected item data
    setVisible(true); // Show the modal
  };


  const handleCloseModal = () => {
    setVisible(false); // Close the modal
    setSelectedItem(null); // Clear the selected item
  };


  // const filteredItems = menuItems?.filter(item => item.CategoryName === selectedCategory);

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item?.CategoryName === selectedCategory)
    : menuItems;


  // Calculate total price from the cart items
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.Price) * item.quantity);
  }, 0).toFixed(2);

  // console.log("Total Price: ",totalPrice);


  if (!menu || !Array.isArray(filteredItems)) {
    return <div>Loading...</div>;
  }

  const goBackToHome = () => {
    navigate(`/quri/home/${qrcode}`);
  };


  return (

    <>
      <SideBarMenu isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      <section className="p-4 flex-grow overflow-y-auto">
        {/* Header with Hamburger Icon */}

        <div className="flex items-center">

          {/* <button onClick={toggleDrawer}>
            <PiDotsThreeOutline size={20} />
          </button> */}

          <button onClick={goBackToHome}>
            <LeftOutline fontSize={20} className="mr-2" />
          </button>


          {/* Tabs for categories */}
          <Tabs
            activeKey={selectedCategory}
            onChange={handleCategoryChange}  // Ensure category switches
            style={{
              '--active-title-color': 'black',
              '--active-line-color': 'black', // Black with 50% opacity for a softer look
            }}
          >
            {categories.map((category) => (
              <Tabs.Tab
                title={category}
                key={category} // Use category name as key
                style={{ color: selectedCategory === category ? 'black' : '#BFBFBF' }} // Inline style for active/inactive tab
              />
            ))}
          </Tabs>
        </div>


        {/* Filter buttons */}
        {/* <div className="flex space-x-2 mb-4 mt-3">
          <div
            className={`p-[1px] bg-gradient-to-r from-[#FF7B02] to-[#FFD855] rounded-xl ${selectedFilter === 'Summer Deals' ? 'bg-black' : ''
              }`}
          >
            <button
              className={`px-2 py-1 rounded-xl ${selectedFilter === 'Summer Deals' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              onClick={() => handleFilterClick(selectedFilter === 'Summer Deals' ? '' : 'Summer Deals')}
            >
              Summer Deals 🍹
            </button>
          </div>
          <div
            className={`p-[1px] bg-gradient-to-r from-[#FF7B02] to-[#FFD855] rounded-xl ${selectedFilter === "Chef's Pick" ? 'bg-black' : ''
              }`}
          >
            <button
              className={`px-2 py-1 rounded-xl ${selectedFilter === "Chef's Pick" ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              onClick={() => handleFilterClick(selectedFilter === "Chef's Pick" ? '' : "Chef's Pick")}
            >
              Chef’s Pick 👨‍🍳
            </button>
          </div>
          <div
            className={`p-[1px] bg-gradient-to-r from-[#FF7B02] to-[#FFD855] rounded-xl ${selectedFilter === 'Fan Favorite' ? 'bg-black' : ''
              }`}
          >
            <button
              className={`px-2 py-1 rounded-xl ${selectedFilter === 'Fan Favorite' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              onClick={() => handleFilterClick(selectedFilter === 'Fan Favorite' ? '' : 'Fan Favorite')}
            >
              Fan Favorite 🏆
            </button>
          </div>
        </div> */}



        {/* Menu items */}
        <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {filteredItems.map((item, index) => (
            <React.Fragment key={item?.MenuID || index}>
              {/* menu item rendering */}
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => handleMenuItemClick(item)}
              >
                <div className="w-full">
                  <div className="flex flex-row items-center">
                    <h3 className="font-normal text-2xl">{item?.ItemName}</h3>
                    {item?.discount && (
                      <Badge content={`${item.discount}% Off`} style={{ marginLeft: 4 }} />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{item?.ItemDescription}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-800">{item?.Price} AED</span>
                  </div>
                </div>

                {item?.Image && (
                  <Image
                    lazy
                    src={
                      item.Image.startsWith('food-uploads/')
                        ? `${BASE_URL}/${item.Image}`
                        : item.Image
                    }
                    width={100}
                    height={100}
                    fit="cover"
                    className="ml-4"
                    style={{ borderRadius: 12 }}
                  />
                )}
              </div>

              {(index + 1) % 3 === 0 && index + 1 !== filteredItems.length && (
                <div className="flex items-center justify-center mb-4">
                  <Image lazy src={cardImg} alt="Special Offer Image" fit="cover" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>


        {cartItems.length > 0 && (
          <div
            style={{
              position: 'fixed',
              bottom: "2%",
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              padding: '10px 0',
              zIndex: 1000,
              width: '90%',
              maxWidth: '500px',
              display: 'flex',
              justifyContent: 'center',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <ViewOrderButton totalPrice={totalPrice} />
          </div>
        )}




        {/* Modal Component */}
        {visible && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1100,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ItemModal
              visible={visible}
              item={selectedItem}
              onClose={handleCloseModal}
            />
          </div>
        )}




        {/* Conditionally render ViewOrderButton if there are cart items */}
        {/* {cartItems.length > 0 && (
          <ViewOrderButton totalPrice={totalPrice} />
        )} */}


        {/* <PlaceOrderButton /> */}
      </section>

    </>
  );
};

export default MenuItems;
