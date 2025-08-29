import React, { createContext, useState, useContext } from 'react';

const DrawerContext = createContext();


export const DrawerProvider = ({ children }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isFAQOpen, setFAQOpen] = useState(false);
    const [isRewardsModalOpen, setRewardsModalOpen] = useState(false);
    const [previousScreen, setPreviousScreen] = useState(null);

    // const [restaurantInfoSubmitted, setRestaurantInfoSubmitted] = useState(false);
    // const [logoSubmitted, setLogoSubmitted] = useState(false);
    // const [checkModalClose, setCheckModalClose] = useState(false);

    // const triggerModalCloseCheck = () => {
    //     setCheckModalClose(true);  // This will signal the modal to re-check closure conditions
    // };

    // const resetModalCloseCheck = () => {
    //     setCheckModalClose(false);  // Reset it after modal closure
    // };


    const toggleDrawer = () => {
        if (isFAQOpen) {
            setFAQOpen(false); // Close FAQ if it's open
        }
        setDrawerOpen(!isDrawerOpen);
    };

    const toggleFAQ = () => {
        if (isDrawerOpen) {
            setDrawerOpen(false); // Close Drawer when FAQ is opened
        }
        setFAQOpen(!isFAQOpen); // Toggle FAQ open/close
    };

    // Function to toggle the Rewards modal
    const toggleRewardsModal = () => {
        setRewardsModalOpen(prevState => !prevState);
    };

    // Function to handle setting the previous screen and toggling the drawer
    const openPreviousScreen = () => {
        if (previousScreen === 'SideBarMenu') {
            setFAQOpen(false); // Close FAQ if it's open
            setDrawerOpen(true); // Open the SideBarMenu
            setPreviousScreen(null); // Reset previous screen
        } else {
            setDrawerOpen(!isDrawerOpen);
        }
    };

    return (
        <DrawerContext.Provider value={{
            isDrawerOpen,
            isFAQOpen,
            isRewardsModalOpen,
            toggleDrawer,
            toggleFAQ,
            toggleRewardsModal,
            openPreviousScreen,
           
        }}>
            {children}
        </DrawerContext.Provider>
    );
};


export const useDrawer = () => useContext(DrawerContext);