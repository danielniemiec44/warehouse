import React, { useState } from 'react';
import PropTypes from 'prop-types';

const EditQuantity = ({ itemId }) => {
    const [quantity, setQuantity] = useState('');

    const handleUpdate = async () => {
        try {
            const response = await fetch('/api/warehouse/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: itemId, quantity }),
            });
            if (response.ok) {
                alert('Quantity updated!');
            } else {
                alert('Failed to update quantity.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <input
                type="number"
                placeholder="New Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <button onClick={handleUpdate}>Update</button>
        </div>
    );
};

EditQuantity.propTypes = {
    itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default EditQuantity;
