import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import UnitModal from './unitModal';
import AddonModal from './addonModal';
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from "@mui/material";

import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Addon() {
  const [isAddonOpen, setIsAddonOpen] = useState(false);
  const [addonOperation, setAddonOperation] = useState('');
  const [editModal, setEditModal] = useState(false)
  const [selectedAddon, setSelectedAddon] = useState(null);

  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [unitOperation, setUnitOperation] = useState('');
  const [addons, setAddons] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const restId = localStorage.getItem('RestaurantID') || null;
  const [units, setUnits] = useState([]);

  useEffect(() => {
    getAddons()
    getUnits()
  }, [])


  const getUnits = async () => {

    try {
      const resp = await fetch(`${BASE_URL}/restaurant/menu/getunits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restId: restId
        })
      });

      const data = await resp.json();
      setUnits(data)
      // console.log("units", data)

    } catch (err) {
      console.error("Error in getUnits:", err);
      throw new Error("Error occurred while fetching units");
    }

  }


  const getAddons = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/restaurant/menu/getaddons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restId: restId
        })
      });

      const data = await resp.json();
      // console.log(data.data)
      setAddons(data.data);
    } catch (err) {
      console.error("Error in getUnits:", err);
      throw new Error("Error occurred while fetching units");
    }

  }

  const addAddon = () => {
    setIsAddonOpen(true);
    setAddonOperation('add');
  };

  const addUnit = () => {
    setIsUnitOpen(true);
    setUnitOperation('add');
  };

  const closeAddon = () => {
    setIsAddonOpen(false);
  }

  const closeUnit = () => {
    setIsUnitOpen(false);
  }



  const handleEdit = (item) => {
    setSelectedAddon(item);
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/restaurant/menu/update-addon`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedAddon.id,
          name: selectedAddon.name,
          unit: selectedAddon.unit,
          price: selectedAddon.price,
          description: selectedAddon.description,
          restId: selectedAddon.restId
        })
      });

      const data = await response.json();

      if (data.success) {
        setMsg("✅Addon updated successfully");
        setEditModal(false);
        setSelectedAddon(null);

        // refresh parent data
        getAddons();
      }
    } catch (err) {
      setMsg("⚠️Update failed");
      console.error("Error updating addon:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const resp = await fetch(`${BASE_URL}/restaurant/menu/deleteAddon`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id
        })
      });

      const data = await resp.json();
      if (data.success) {
        getAddons()
      }

    } catch (err) {
      console.error("Error in deleting addons :", err);
      throw new Error("Error occurred while deleting addons");
    }


  }

  return (
    <div className="mt-10">

      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            className="w-full dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={addAddon}
          >
            Add Addon
          </Button>
        </Grid>

        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            className="w-full dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={addUnit}
          >
            Add Unit
          </Button>
        </Grid>
      </Grid>
      <br></br>
      <br></br>
      <br></br>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={msg.includes("✅") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {msg}
        </Alert>
      </Snackbar>

      <Grid container spacing={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...addons].reverse().map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>



      <AddonModal
        operation={addonOperation}
        open={isAddonOpen}
        onClose={closeAddon}
        onSaved={getAddons}
      />

      <UnitModal
        operation={unitOperation}
        open={isUnitOpen}
        onClose={closeUnit}
        onSaved={getUnits}
      />


      <Dialog open={editModal} onClose={() => setEditModal(false)} fullWidth>
        <DialogTitle>Edit Addon</DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={selectedAddon?.name || ""}
              onChange={(e) =>
                setSelectedAddon({ ...selectedAddon, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Unit"
              fullWidth
              value={selectedAddon?.unit || ""}
              onChange={(e) =>
                setSelectedAddon({ ...selectedAddon, unit: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              value={selectedAddon?.price || ""}
              onChange={(e) =>
                setSelectedAddon({ ...selectedAddon, price: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={selectedAddon?.description || ""}
              onChange={(e) =>
                setSelectedAddon({ ...selectedAddon, description: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>


    </div>
  );
}

export default Addon;
