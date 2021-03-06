import { useMemo, useState } from "react";
import { getStaticPrice } from "../category/components/product_grid";
import { Order, OrderProductItem, Product } from "../../types";

type UseCartProps = {
  order: Order;
  clearCart: () => void;
  message: string | null;
  onIncrementPosition: (item: OrderProductItem) => void;
  onDeletePosition: (item: OrderProductItem) => void;
  changeElementVariant: (item: Product, index: number) => void;
  onDecrementPosition: (item: OrderProductItem) => void;
};
const useCart: () => UseCartProps = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>(
    JSON.parse(localStorage.getItem("new_possum_orders") || "null") || {
      items: {},
      meta: { sum: 0, count: 0, weight: 0 },
    }
  );
  const getMaxAvailable: (item: OrderProductItem) => number = (item) => {
    const e = item.elements?.find((el) => el.active);
    if (!e || e.item === null) {
      return item.quantity;
    }
    return e.item.quantity;
  };
  const onIncrementPosition: (item: OrderProductItem) => void = (item) => {
    try {
      const updatedOrder = { ...order };
      if (item.id in updatedOrder.items) {
        const maxAvailable = getMaxAvailable(item);
        if (updatedOrder.items[item.id].count >= maxAvailable) {
          throw Error(
            `Нельзя заказать больше ${maxAvailable} штук(и) данного товара`
          );
        }
        updatedOrder.items[item.id].count++;
      } else {
        let i = 0;
        //если новый проставляем активности на варианты
        item.elements.forEach((el) => {
          if (
            (el.item === null || (el.item && el.item.available === "Y")) &&
            i === 0
          ) {
            el.active = true;
            i++;
            return;
          }
          el.active = false;
        });
        //определяем границу доступных в этой цене
        const maxAvailable = getMaxAvailable(item);
        if (maxAvailable < 1) {
          throw Error(`Сейчас данный товар недоступен к покупке`);
        }
        updatedOrder.items[item.id] = {
          item: item,
          count: 1,
        };
      }
      let count = 0;
      let sum = 0;
      let weight = 0;
      for (let key in updatedOrder.items) {
        count = count + updatedOrder.items[key].count;
        const activeElement = updatedOrder.items[key].item.elements.find(
          (el) => el.active
        );
        if (!activeElement) {
          throw Error("Не найдет выбранный вариант товара");
          return;
        }
        const priceOfActiveElement = getStaticPrice(activeElement);
        sum = sum + updatedOrder.items[key].count * priceOfActiveElement.price;
        weight = weight + updatedOrder.items[item.id].count * 0.7;
      }
      updatedOrder.meta = { count: count, sum: sum, weight: weight };
      const serialized = JSON.stringify(updatedOrder);
      localStorage.setItem("new_possum_orders", serialized);
      setOrder(updatedOrder);
    } catch (e) {
      setMessage(e as string);
    }
  };
  const onDeletePosition: (item: OrderProductItem) => void = (item) => {
    const updatedOrder = { ...order };
    delete updatedOrder.items[item.id];
    let count = 0;
    let sum = 0;
    let weight = 0;
    for (let key in updatedOrder.items) {
      count = count + updatedOrder.items[key].count;
      const activeElement = updatedOrder.items[key].item.elements.find(
        (el) => el.active
      );
      if (!activeElement) {
        throw Error("Не найдет выбранный вариант товара");
        return;
      }
      const priceOfActiveElement = getStaticPrice(activeElement);
      sum = sum + updatedOrder.items[key].count * priceOfActiveElement.price;
      weight = weight + updatedOrder.items[key].count * 0.7;
    }
    updatedOrder.meta = { count: count, sum: sum, weight: weight };

    const serialized = JSON.stringify(updatedOrder);
    localStorage.setItem("new_possum_orders", serialized);
    setOrder(updatedOrder);
  };
  const changeElementVariant = async (item: Product, index: number) => {
    const updatedOrder = { ...order };
    await updatedOrder.items[item.id].item.elements.forEach((el, i) => {
      el.active = i === index;
    });
    const maxAvailable = getMaxAvailable(item);
    if (updatedOrder.items[item.id].count > maxAvailable) {
      updatedOrder.items[item.id].count = maxAvailable;
    }
    let count = 0;
    let sum = 0;
    let weight = 0;
    for (let key in updatedOrder.items) {
      count = count + updatedOrder.items[key].count;
      const activeElement = updatedOrder.items[key].item.elements.find(
        (el) => el.active
      );
      if (!activeElement) {
        throw Error("Не найдет выбранный вариант товара");
        return;
      }
      const priceOfActiveElement = getStaticPrice(activeElement);
      sum = sum + updatedOrder.items[key].count * priceOfActiveElement.price;
      weight = weight + updatedOrder.items[key].count * 0.7;
    }
    updatedOrder.meta = { count: count, sum: sum, weight: weight };
    const serialized = JSON.stringify(updatedOrder);
    localStorage.setItem("new_possum_orders", serialized);
    setOrder(updatedOrder);
  };
  const onDecrementPosition = (item: OrderProductItem) => {
    console.log("onDecrementPosition");
    const updatedOrder = { ...order };
    if (item.id in updatedOrder.items) {
      if (updatedOrder.items[item.id].count === 1) {
        delete updatedOrder.items[item.id];
      } else {
        updatedOrder.items[item.id].count--;
      }
    }
    let count = 0;
    let sum = 0;
    let weight = 0;
    for (let key in updatedOrder.items) {
      count = count + updatedOrder.items[key].count;
      const activeElement = updatedOrder.items[key].item.elements.find(
        (el) => el.active
      );
      if (!activeElement) {
        throw Error("Не найдет выбранный вариант товара");
        return;
      }
      const priceOfActiveElement = getStaticPrice(activeElement);
      sum = sum + updatedOrder.items[key].count * priceOfActiveElement.price;
      weight = weight + updatedOrder.items[key].count * 0.7;
    }
    updatedOrder.meta = { count: count, sum: sum, weight: weight };
    const serialized = JSON.stringify(updatedOrder);
    localStorage.setItem("new_possum_orders", serialized);
    setOrder(updatedOrder);
  };
  const clearCart: () => void = () => {
    localStorage.setItem(
      "new_possum_orders",
      JSON.stringify({ items: {}, meta: { sum: 0, weight: 0, count: 0 } })
    );
    const updatedOrder = { items: {}, meta: { sum: 0, weight: 0, count: 0 } };
    setOrder(updatedOrder);
  };
  return {
    order: useMemo(() => order, [order]),
    clearCart,
    message,
    onIncrementPosition,
    onDeletePosition,
    changeElementVariant,
    onDecrementPosition,
  };
};
export { useCart };
