import React, { useState } from 'react';
import { Drawer, Typography, Box, List, ListItem, ListItemText, ListItemButton, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HeaderImage from '../../../../assets/Billing/Quri-Heading.png';
import { useDrawer } from '../../../../state/drawerContext';
import { LeftOutline } from 'antd-mobile-icons';
const FAQ = () => {
    const { isFAQOpen, toggleFAQ, openPreviousScreen, previousScreen,toggleDrawer } = useDrawer();

    // State to manage the collapse of each question individually
    const [openItems, setOpenItems] = useState({});

    // Handler for toggling collapsible content for each question
    const handleClick = (index) => {
        setOpenItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    return (
        <Drawer anchor="left" open={isFAQOpen} onClose={openPreviousScreen}>
            <div className="flex flex-col items-center min-h-screen w-80 p-2">
            <button onClick={openPreviousScreen}>
                    <div className='flex absolute top-4 left-4'>
                        <LeftOutline fontSize={20} />
                    </div>
                </button>
                <div className="flex flex-col items-center mb-4">
                    <img src={HeaderImage} alt="Quri Image" width="100" />
                </div>

                <Typography variant="h5" gutterBottom align="center" sx={{ textDecoration: 'underline' }}>
                    FAQ
                </Typography>

                <List className="w-full mt-4">
                    {/* Question 1 */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleClick(0)}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>
                                            How do I use Quri to place an order at a restaurant?
                                            <IconButton edge="end">
                                                {openItems[0] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </Typography>
                                    }
                                />

                            </Box>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openItems[0]} timeout="auto" unmountOnExit>
                        <Typography variant="body2" className="p-3">
                            Simply scan the QR code on your table using your phone. This will take you to the restaurant's menu, where you can browse, select your items, and place your order directly from your device.
                        </Typography>
                    </Collapse>

                    {/* Question 2 */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleClick(1)}>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>
                                        Is it safe to make payments through Quri?
                                        <IconButton edge="end">
                                            {openItems[1] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </Typography>
                                }
                            />

                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openItems[1]} timeout="auto" unmountOnExit>
                        <Typography variant="body2" className="p-3">
                            Yes, all payments through Quri are processed securely with industry-standard encryption.
                        </Typography>
                    </Collapse>

                    {/* Question 3 */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleClick(2)}>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>
                                        What if I have an issue with my order or payment through Quri?
                                        <IconButton edge="end">
                                            {openItems[2] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </Typography>
                                }
                            />

                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openItems[2]} timeout="auto" unmountOnExit>
                        <Typography variant="body2" className="p-3" >
                            If you encounter any issues, you can reach out to our customer support for quick assistance.
                        </Typography>
                    </Collapse>
                </List>
            </div>
        </Drawer>
    );
};

export default FAQ;
