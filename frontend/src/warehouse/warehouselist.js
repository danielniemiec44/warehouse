import React from "react";
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { setEditEntryId } from "./features/EditWarehouseModal";

const WarehouseList = ({ products }) => {
    const dispatch = useDispatch();

    return (
        <div>
            {products.map((product) => (
                <div key={product.id}>
                    <span>{product.product_name}</span>
                    <button onClick={() => dispatch(setEditEntryId(product.id))}>
                        Edytuj
                    </button>
                </div>
            ))}
        </div>
    );
};

WarehouseList.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            product_name: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default WarehouseList;
