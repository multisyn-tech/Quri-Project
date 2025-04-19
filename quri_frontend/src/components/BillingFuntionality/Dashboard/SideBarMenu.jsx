import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer, List, ListItemText, CardContent, Button, Typography, ListItemButton } from '@mui/material';
import HeaderImage from '../../../assets/Billing/Modal_Pic.png';
import { TbHearts } from "react-icons/tb";
import { RiQuestionnaireLine } from "react-icons/ri";
import { VscChevronRight } from "react-icons/vsc";
import FooterImage from '../../../assets/Billing/Quri-Heading.png';
import { useDrawer } from '../../../state/drawerContext';
import FAQ from './SideBarContent/FAQ';
import Rewards from './Rewards/Rewards';
import { LeftOutline } from 'antd-mobile-icons';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SideBarMenu = () => {
  const { isRewardsModalOpen, isFAQOpen, isDrawerOpen, toggleDrawer, toggleFAQ, toggleRewardsModal, openPreviousScreen, previousScreen } = useDrawer(); // Get functions and state from context

  const settings = useSelector((state) => state.qrcode.qrCodeDetails.data?.settings);

  // Find the setting with KeyID 'RestaurantName'
  const restaurantName = settings?.find(setting => setting.KeyID === 'RestaurantName')?.Value || 'Unknown Restaurant';

  // Find the setting with KeyID 'image' for the header image
  const headerImageUrl = settings?.find(setting => setting.KeyID === 'image')?.Value || HeaderImage;


  return (
    <>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>

        {/* Container with full height to center content */}
        <div className="flex flex-col items-center justify-center min-h-screen w-80 p-4">
          <button onClick={() => previousScreen ? openPreviousScreen(null) : toggleDrawer()}>
            <div className='flex absolute top-6 left-4'>
              <LeftOutline fontSize={20} />
            </div>
          </button>

          <div className="flex flex-col items-center mb-4">
            {/* Header Image */}
            <div className="relative p-[1px] rounded-[20px] bg-gradient-to-r from-[#FF5AA7] via-[#FFD855] to-[#FF7B02]">
              <img
                src={headerImageUrl.startsWith('uploads/') ? `${BASE_URL}/${headerImageUrl}` : headerImageUrl}
                alt="Header Image"
                className="w-[90px] h-[90px] rounded-[19px] border border-transparent bg-white p-[2px]"
                style={{
                  maskImage: "linear-gradient(white, white)",
                  WebkitMaskImage: "linear-gradient(white, white)"
                }}
              />
            </div>

            {/* Restaurant Name */}
            <Typography variant="h6" gutterBottom align="center" className='my-2'>
              {restaurantName}
            </Typography>
          </div>


          {/* Card Section */}
          <div className="flex bg-[#4D4D4D] rounded-[15px] mb-2">
            <CardContent className="flex flex-col justify-center text-white">
              <Typography component="div" className="mb-4 leading-tight font-normal">
                Earn rewards by joining Quri
              </Typography>
              <Button
                variant="contained"
                style={{
                  alignSelf:'flex-end',
                  backgroundColor: '#FF7B02',
                  color: '#fff',
                  borderRadius: '20px',
                  padding: '4px 20px',
                  textTransform: 'none',
                  minWidth: 'auto', // Override default MUI minWidth
                  width: 'fit-content' // Ensures it wraps tightly around the text
                }}
                onClick={() => {
                  toggleRewardsModal(); // Open the Rewards modal
                  toggleDrawer(); // Close the sidebar drawer
                }}
              >
                Join now
              </Button>
            </CardContent>
            <div className="w-3/4">
              <img
                src="https://media-cdn.tripadvisor.com/media/photo-s/0e/1b/40/3f/fine-dining-restaurant.jpg"
                alt="Reward Image"
                className="w-full h-full object-cover rounded-r-[15px]"
              />
            </div>
          </div>

          {/* Menu Items Section */}
          <List className="w-full flex flex-col gap-1">
            <ListItemButton className="flex justify-center items-center">
              <TbHearts size={24} className="mr-2" />
              <ListItemText
                primary={
                  <Typography variant="body2" className="text-black font-normal">
                    Leave a review
                  </Typography>
                }
              />
              <VscChevronRight size={20} className="ml-2" />
            </ListItemButton>

            <ListItemButton className="flex justify-center items-center" onClick={toggleFAQ}>
              <RiQuestionnaireLine size={24} className="mr-2" />
              <ListItemText
                primary={
                  <Typography variant="body2" className="text-black font-normal">
                    Frequently asked questions
                  </Typography>
                }
              />
              <VscChevronRight size={20} className="ml-2" />
            </ListItemButton>
          </List>


          {/* Footer Content */}
          <div className="position-absolute bottom-0 py-10">
            <img src={FooterImage} alt="Quri Image" width="70" height="26" />
          </div>
        </div>
      </Drawer>

      {/* Rewards Modal */}
      {isRewardsModalOpen && <Rewards />}


      {/* FAQ Drawer */}
      {isFAQOpen && <FAQ />}

    </>
  );
};

export default SideBarMenu;
