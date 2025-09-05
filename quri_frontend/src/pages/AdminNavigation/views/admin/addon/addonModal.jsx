import React, { useState, useEffect } from 'react'
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, DialogActions, FormControl, InputLabel, Button, Alert } from '@mui/material';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Modal({ open, onClose, operation, onSaved }) {


    const [message, setMessage] = useState('');
    const [units, setUnits] = useState([]);
    const [addons, setAddons] = useState([]);

    const restId = localStorage.getItem('RestaurantID') || null;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        unit: '',
        description: ''
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        getUnits()
    })

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

            const unique = [];
            const seen = new Set();

            for (const item of data.data) {
                const nameKey = item.name.toLowerCase();
                if (!seen.has(nameKey)) {
                    seen.add(nameKey);
                    unique.push(item);
                }
            }

            setUnits(unique);


        } catch (err) {
            console.error("Error in getUnits:", err);
            throw new Error("Error occurred while fetching units");
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    const saveAddon = async (e) => {
        e.preventDefault()
        setMessage('');
      

        try {
            const response = await fetch(`${BASE_URL}/restaurant/menu/add-addon`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    unit: formData.unit,
                    name: formData.name,
                    price: formData.price,
                    description: formData.description,
                    restId: restId
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(async () => ({ message: await response.text() }));
                // console.error("API error:", err);
                return;
            }

            const data = await response.json();
            // console.log(data)
            setAddons(data.data)

            if (data.success) {
                setMessage('✅ Addon added sucessfully')
                setFormData({ name: '', description: '', price: '', unit: '' });
            }
            if (onSaved) onSaved();
        }
        catch (error) {
            console.error("some error occured:", error)
        } finally {
            onClose();
        }

    }


    return (
        <div>
            {/* {message && (
                <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )} */}
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogContent>

                    <form onSubmit={saveAddon}>
                        <DialogTitle>{operation === "add" ? "Add Addon" : "Edit Addon"}</DialogTitle>
                        <DialogContent>
                            <TextField
                                id="name"
                                name="name"
                                label="Addon Name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                            />
                        </DialogContent>
                        <DialogContent>
                            <TextField
                                id="price"
                                name="price"
                                label="Price"
                                value={formData.price}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                            />
                        </DialogContent>


                        <DialogContent>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="unit-label">Unit</InputLabel>
                                <Select
                                    labelId="unit-label"
                                    id="unit"
                                    name="unit"
                                    value={formData.unit || ""}
                                    onChange={handleChange}
                                >
                                    {units.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.name}>
                                            {unit.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </DialogContent>


                        <DialogContent>
                            <TextField
                                id="description"
                                name="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </form>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Modal
