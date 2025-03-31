import ProductItem from "./ProductItem";
import React from "react";


const ProductList = ({ saleItems, updateQuantity, changeQuantityByButton }) => {
    return (
        <>
        {saleItems?.map((item, index) => {
            return (
                <ProductItem
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity && ((item, value) => updateQuantity(item, value))}
                    changeQuantityByButton={changeQuantityByButton && ((item, value) => changeQuantityByButton(item, value))}
                />
            )
        }
        )}
        </>
    )
}

export default ProductList;