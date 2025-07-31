import React, { useState, useEffect } from 'react';
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, Modal, ModalBody, ModalHeader, Alert, Spinner, ModalFooter } from 'reactstrap';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import FirstTimeRestaurantInfo from './FirstTimeRestaurantInfo';
import FirstTimeLogo from './FirstTimeLogo';
import { getSettings, getRestaurantSettings } from '../../../../features/settings/settingSlice';

const FirstTimeSettings = ({ children }) => {
    const [activeTab, setActiveTab] = useState('1');
    const [modalOpen, setModalOpen] = useState(true); // Modal is always open

    const dispatch = useDispatch();

    // Fetch data on component mount
    useEffect(() => {
        dispatch(getSettings());
        dispatch(getRestaurantSettings());
    }, [dispatch]);

    // Get data from Redux store
    const settings = useSelector((state) => state.settings?.settings);
    const restaurantSettings = useSelector((state) => state.settings?.restaurantSettings);
    const settingsLoading = useSelector((state) => state.settings.loading); // Loading state for fetching data

    // Effect to check if data has been added successfully, and close the modal
    useEffect(() => {
        const hasSettings = settings && settings.length > 0;
        const hasRestaurantSettings = restaurantSettings && restaurantSettings.length > 0;

        // Check the modal close flag and close if both submissions are done
        if (hasSettings && hasRestaurantSettings) {
            setModalOpen(false); // Close modal if both data sets already exist
        }
    }, [settings, restaurantSettings]);


    // Function to toggle between tabs
    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen); // Allow manual dismissal regardless of data checks
    };

    return (
        <>
         {/* Render children components wrapped by this logic */}
         {children}
         
            {/* Modal is always open */}
            <Modal isOpen={modalOpen} centered toggle={() => { }} size="lg">
                <ModalHeader toggle={toggleModal} className='font-bold text-lg'>
                    Please Provide Your Restaurant Information
                </ModalHeader>
                <ModalBody>
                    <div className="flex settings-card bg-white shadow-md rounded-lg p-4">
                        <Row>
                            <Col sm="3">
                                <Nav pills vertical>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '1', 'cursor-pointer': true })}
                                            onClick={() => { toggle('1'); }}
                                        >
                                            Basic Information
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === '2', 'cursor-pointer': true })}
                                            onClick={() => { toggle('2'); }}
                                        >
                                            Logo
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                            <Col sm="9">
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1">
                                        <FirstTimeRestaurantInfo />
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <FirstTimeLogo />
                                    </TabPane>
                                </TabContent>
                            </Col>
                        </Row>
                    </div>
                    {settingsLoading && (
                        <Spinner color="primary" className="mt-3">
                            Loading data...
                        </Spinner>
                    )}

                </ModalBody>
                <ModalHeader centered className='text-lg'>
                 The modal will keep popping up unless Information is provided
                </ModalHeader>
            </Modal>
        </>
    );
};

export default FirstTimeSettings;
