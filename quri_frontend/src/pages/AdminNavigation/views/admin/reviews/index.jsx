import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { RiEyeFill } from "react-icons/ri";
import Rating from '@mui/material/Rating';
import ReviewModal from './ReviewModal';
import SearchBar from './SearchBar';
import { jsonToCSV, downloadCSV } from './csvUtils';
import { fetchReviewsByRestaurant } from '../../../../../features/reviews/reviewSlice';
import dayjs from 'dayjs';

const Reviews = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { reviews, status, error } = useSelector((state) => state.reviews);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);

  const columns = [
    { field: 'ReviewID', headerName: 'Review ID', flex: 1 },
    { field: 'ItemName', headerName: 'Item Name', flex: 1 },
    { field: 'CustomerName', headerName: 'Customer Name', flex: 1 },
    { field: 'Rating', headerName: 'Rating', flex: 1, renderCell: (params) => (
        <Rating name="read-only" value={Number(params.value)} readOnly />
      )
    },
    { field: 'CreatedAt', headerName: 'Review Date', flex: 1 },
    {
      field: 'Action', headerName: 'Action', flex: 1, renderCell: (params) => (
        <div className="flex items-center w-full h-full">
          <RiEyeFill
            size={22}
            className="text-brand-500 dark:text-blue-500 cursor-pointer"
            onClick={() => handleView(params.row)}
          />
        </div>
      )
    },
  ];

  useEffect(() => {
    dispatch(fetchReviewsByRestaurant());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      filterRows();
    }
  }, [reviews, searchText, dateFilter, status]);

  const filterRows = () => {
    const lowercasedSearchText = searchText.toLowerCase();
    const formattedDateFilter = dateFilter ? dayjs(dateFilter).format('MM-DD-YYYY') : '';
    const filteredData = reviews.filter(row => {
      const matchesText = (row.Comments && row.Comments.toLowerCase().includes(lowercasedSearchText)) ||
        (row.CustomerName && row.CustomerName.toLowerCase().includes(lowercasedSearchText)) ||
        (row.ItemName && row.ItemName.toLowerCase().includes(lowercasedSearchText));
      const matchesDate = formattedDateFilter ? dayjs(row.CreatedAt).format('MM-DD-YYYY') === formattedDateFilter : true;
      return matchesText && matchesDate;
    });
    setFilteredRows(filteredData);
  };

  const handleView = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReview(null);
  };

  const handleExport = () => {
    const csv = jsonToCSV(filteredRows, columns.filter(col => col.field !== 'Action'));
    downloadCSV(csv, 'reviews.csv');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='w-full mt-4'>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onSearch={() => {}}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onExport={handleExport}
      />
      <DataGrid
        rows={filteredRows}
        getRowId={(row) => row.ReviewID} 
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        className="text-gray-800 dark:text-white"
        autoHeight
        sx={{
          '& .MuiDataGrid-root': {
            color: theme.palette.text.primary,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
          '& .MuiDataGrid-toolbarContainer': {
            backgroundColor: theme.palette.background.paper,
          },
          '& .MuiTablePagination-root': {
            color: theme.palette.text.primary,
          },
        }}
      />
      <ReviewModal open={open} onClose={handleClose} review={selectedReview} />
    </div>
  );
};

export default Reviews;
