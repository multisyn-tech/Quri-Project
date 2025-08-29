import React, { Fragment, useState, useEffect } from 'react';
import { ChevronDown, Plus } from 'react-feather';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import AddModal from './AddModal';
import DataTable, { createTheme } from 'react-data-table-component';
import { useTheme } from '../state/themeContext';

// Create a custom theme for dark mode
createTheme('dark', {
  text: {
    primary: '#ffffff',
    secondary: '#b4b4b4',
  },
  background: {
    default: '#1f2937', // Tailwind dark:bg-gray-800 equivalent
  },
  context: {
    background: '#333333',
    text: '#FFFFFF',
  },
  divider: {
    default: '#424242',
  },
  button: {
    default: '#ffffff',
    hover: 'rgba(0,0,0,.08)',
    focus: 'rgba(255,255,255,.12)',
    disabled: 'rgba(0, 0, 0, .12)',
  },
  sortFocus: {
    default: '#FFFFFF',
  },
});

const QuriTable = ({ propsData, columns, tableData = [], name, setTableData }) => {

  // console.log(tableData)
  // Initialize theme state from localStorage
  //const [theme, setTheme] = useState(localStorage.getItem('darkmode') === 'true' ? 'dark' : 'light');
  // console.log(theme)
  const { darkMode } = useTheme();
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [modal, setModal] = useState(false);

  const handleModal = () => setModal(!modal);

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);

    if (value.length) {
      const updatedData = tableData.filter(item =>
        Object.keys(item).some(key =>
          item[key] && item[key].toString().toLowerCase().includes(value)
        )
      );
      setFilteredData(updatedData);
    } else {
      setFilteredData(tableData);
    }
  };

  const handlePagination = (page, rowsPerPage) => {
    // Add your pagination logic here
  };

  const handleReset = () => {
    setSearchValue('');
    setFilteredData(tableData);
  };

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  return (
    <>
      {name === "Order" ? (
        <>
          <Row>
            <Col lg={4} md={3} sm={6} xs={10} className="d-flex justify-content-between pl-2 mt-1 mb-1">
              <Label className="my-auto p-2 mx-auto dark:text-white" for="search-input"></Label>

              <Input
                className="dataTable-filter"
                type="text"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={handleFilter}
                placeholder='Search'
              />
            </Col>
            <Col lg={3} md={4} sm={6} xs={10} className="mb-1 mt-1 justify-content-between s pl-2">
              <Button color="primary" style={{ marginRight: '0.5rem' }} type="button" onClick={handleFilter}>
                Search
              </Button>
              <Button outline color="primary" type="button" onClick={handleReset}>
                Reset
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col xs={4} sm={2} md={3} lg={3} className="d-flex justify-content-between align-items-center pl-2 mt-1 mb-1">
            <Label className="mx-1" for="search-input">Search</Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
          <Col className='d-flex justify-content-end' style={{ marginRight: "1rem" }}>
            <Button className="btn-icon" color="primary" outline onClick={handleModal}>
              <Plus size={15} />
            </Button>
          </Col>
        </Row>
      )}

      <div className={`bg-white dark:bg-gray-800`}>
        <DataTable
          noHeader
          fixedHeader
          columns={columns.map(col => ({
            ...col,
            allowOverflow: undefined,
            center: undefined,
            outline: undefined,
          }))}
          data={searchValue.length ? filteredData : [...tableData].reverse()}
          pagination
          paginationPerPage={25} // item per page
          paginationRowsPerPageOptions={[20, 15, 25, 50, 100]}
          sortIcon={<ChevronDown size={10} />}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => handlePagination(currentPage, currentRowsPerPage)}
          onChangePage={(currentPage) => handlePagination(currentPage, 10)}
          theme={darkMode ? 'dark' : 'light'}
        />
      </div>

      <AddModal
        open={modal}
        setModal={setModal}
        handleModal={handleModal}
        name={name}
        tableData={propsData}
        setTableData={setTableData}
      />
    </>
  );
};

export default QuriTable;
