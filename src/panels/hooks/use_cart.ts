import { useState } from "react";

type UseCartProps = {
    order: any,
    clearCart: () => void
}
const useCart: () => UseCartProps = () => {
    const [order, setOrder] = useState(
        JSON.parse(localStorage.getItem("orders") || "null") || {}
    );
    const clearCart = () => {
        localStorage.setItem("orders", JSON.stringify({}));
        const updatedOrder = {};
        setOrder(updatedOrder);
    };
    return {
        order,
        clearCart
    }
}
export { useCart };
