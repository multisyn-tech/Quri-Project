import React from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import { RiSearchLine } from 'react-icons/ri';
import { IoMdDownload } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
const SearchBar = ({ searchText, setSearchText, onSearch, dateFilter, setDateFilter, onExport }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Date Wise Filter"
            type="date"
            variant="outlined"
            size="small"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center" p={2} my={2} width="100%">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Search by Product or Customer"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RiSearchLine />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              height: '40px',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            onClick={onSearch}
          >
            Search
          </Button>
          <Box ml={2}>
            <Button variant="outlined" color="primary" onClick={onExport}>
              <IoMdDownload size={15} />
              Export
            </Button>
          </Box>
          <Box ml={2}>
            <Button variant="contained" color="primary" >
              < IoMdAdd size={20} />
              Review
            </Button>
          </Box>

        </Box>

      </Box>
    </div>
  );
};

export default SearchBar;
