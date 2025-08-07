import React, { useState } from 'react';
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import Logo from './Logo';
import BackgroundCover from './BackgroundCover';
import RestaurantInfo from './RestaurantInfo';
import WorkingHours from './WorkingHours';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <div className="flex mt-5 settings-card bg-white shadow-md rounded-lg p-4">
        <Row>
          <Col sm="3">
            <Nav pills vertical>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1','cursor-pointer': true  })}
                  onClick={() => { toggle('1'); }}
                >
                  Basic Information
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2','cursor-pointer': true })}
                  onClick={() => { toggle('2'); }}
                >
                  Logo
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '3','cursor-pointer': true  })}
                  onClick={() => { toggle('3'); }}
                >
                 Background cover
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '4','cursor-pointer': true  })}
                  onClick={() => { toggle('4'); }}
                >
                  Working Hours
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col sm="9">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <RestaurantInfo />
              </TabPane>
              <TabPane tabId="2">
                <Logo />
              </TabPane>
              <TabPane tabId="3">
                <BackgroundCover />
              </TabPane>
              <TabPane tabId="4">
                <WorkingHours />
              </TabPane>
            </TabContent>
          </Col>
          
        </Row>
      </div>
    </>
  );
};

export default Settings;
