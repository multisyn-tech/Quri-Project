import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Alert } from '@mui/material';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UnitModal({ open, onClose, operation, onSave }) {

    const [message, setMessage] = useState('');

    const restId = localStorage.getItem('RestaurantID') || null;

    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));

    }

    const saveUnit = async (e) => {
        e.preventDefault()
        setMessage('');
        try {
            const response = await fetch(`${BASE_URL}/restaurant/menu/add-unit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    restId: restId
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(async () => ({ message: await response.text() }));
                // console.error("API error:", err);
                return;
            }

            const data = await response.json();

            if (data.success) {
                setMessage('✅ Unit added sucessfully')
                setFormData({ name: '' });
            }

            if (onSave) onSave()
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
                <form onSubmit={saveUnit}>
                    <DialogTitle>{operation === "add" ? "Add Unit" : "Edit Unit"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="name"
                            label="Unit Name"
                            value={formData.name}
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
            </Dialog>
        </div>
    )
}
