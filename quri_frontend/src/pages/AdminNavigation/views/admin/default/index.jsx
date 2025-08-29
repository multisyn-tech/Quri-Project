import MiniCalendar from "../../../../../components/AdminFuntionality/components/calendar/MiniCalendar";

import WeeklyRevenue from "./components/WeeklyRevenue";
import TotalSpent from "./components/TotalSpent";
import PieChartCard from "./components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "../../../../../components/AdminFuntionality/components/widget/Widget";
import CheckTable from "./components/CheckTable";
import ComplexTable from "./components/ComplexTable";
import DailyTraffic from "./components/DailyTraffic";
import TaskCard from "./components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardDetails } from "../../../../../features/dashboard/dashboardSlice";
import { useEffect, useState, useRef } from "react";
import { Box, User } from "react-feather";
import { MoneyOffRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";


import Flatpickr from "react-flatpickr"
// import "@styles/react/libs/flatpickr/flatpickr.scss"
import { Card, Col, InputGroup, InputGroupText, Label, Row } from "reactstrap";
import Calendar from "react-calendar";

const Dashboard = () => {

  const flatpickrRef = useRef(null);

  const dispatch = useDispatch()
  const dashDetails = useSelector(state=>state.dashboard.dashboardDetails)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // const today = new Date();
  // const formattedToday = today.toISOString().split('T')[0];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      let obj = {
        startDate: '01-07-2024',
        endDate: '31-07-2024'
      };
      dispatch(getDashboardDetails(obj));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   if(Object.keys(dashDetails).length != 0 ){

  //   }
  // }, [])
  

  return (
    <div>
      {/* Card widget */}
      {/* <Row>
      <Col md='6' lg='6' xl='6' sm='6'>
            <Label className='form-label' for='trial'>Select Dates:</Label>
            <InputGroup>
              <InputGroupText>
                <Calendar size={15} />
              </InputGroupText>
              <Flatpickr
                ref={flatpickrRef}
                className='form-control' id='trial' name='trial'
                options={{
                  mode: 'range',
                  dateFormat: 'Y-m-d',
                  // defaultDate: defaultDates,
                  defaultDate: [startDate || formattedToday, endDate || formattedToday],
                  maxDate: today, // Disable future dates
                  minDate: new Date(today.getFullYear(), today.getMonth(), 1), // Start of the current month
                }}
                // onChange={handleFromDate}
              />
            </InputGroup>
          </Col>
        
      </Row> */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
      
        <Card className="p-4 text-center text-lg font-semibold text-gray-800 shadow-sm">
          <span
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            style={{ textShadow: '2px 2px 1px rgba(0, 0, 0, 0.2)' }}
          >
            {currentDate}
          </span>
        </Card>

        <Link to="/admin/manage/customers">
          <Widget
            icon={<User className="h-7 w-7" />}
            title={"Total Customers"}
            subtitle={dashDetails?.totalCustomers || 0}
          />
        </Link>
        <Link to="/admin/manage/orders">
          <Widget
            icon={<IoDocuments className="h-6 w-6" />}
            title={"Total Completed Orders"}
            subtitle={dashDetails?.totalOrders || 0}
          />
        </Link>

        <Link to="/admin/manage/menu">
          <Widget
            icon={<Box className="h-7 w-7" />}
            title={"Total Products"}
            subtitle={dashDetails?.totalProducts || 0}
          />
        </Link>

        <Link >
        <Widget
          icon={<MoneyOffRounded className="h-6 w-6" />}
          title={"Total Revenue"}
          subtitle={`AED ${dashDetails?.totalSales}` || 0}
        />
        </Link>
       
      </div>

      {/* Charts */}

      {/* <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div> */}

      {/* Tables & Charts */}

      {/* Check Table */}
      {/* <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div> */}

        {/* Traffic chart & Pie Chart */}

        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div> */}

        {/* Complex Table , Task & Calendar */}

        {/* <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        /> */}

        {/* Task chart & Calendar */}

        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div> */}
      </div>
    // </div>
  );
};

export default Dashboard;
