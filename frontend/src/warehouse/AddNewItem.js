
import React, { useState } from 'react';

const AddNewItem = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/warehouse/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, quantity, categoryId }),
            });
            if (response.ok) {
                alert('Item added successfully!');
            } else {
                alert('Failed to add item.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input type="text" placeholder="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
            <button type="submit">Add Item</button>
        </form>
    );
};

export default AddNewItem;
