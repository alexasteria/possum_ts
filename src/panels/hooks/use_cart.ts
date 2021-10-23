import { useState } from "react";

type UseCartProps = {
    order: any,
    clearCart: () => void,
    message: string | null
}
const useCart: () => UseCartProps = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [order, setOrder] = useState(
        JSON.parse(localStorage.getItem("orders") || "null") || {}
    );
    const clearCart = () => {
        localStorage.setItem("orders", JSON.stringify({}));
        const updatedOrder = {};
        setOrder(updatedOrder);
    };
    // const sendMessage = (value: string) => {
    //     setMessage(value);
    // };
    return {
        order,
        clearCart,
        message
    }
}
export { useCart };
