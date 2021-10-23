import React from "react";
import { Avatar, Button, Separator, Banner } from "@vkontakte/vkui";
import { ProductProps } from "../../category/components/product_grid";
import {
  Order,
  OrderProductElement,
  OrderProductItem,
  Product,
} from "../../../types";

type CartListProductsProps = {
  order: Order;
  changeElementVariant: (item: Product, index: number) => void;
  onIncrementPosition: (item: OrderProductItem) => void;
  onDecrementPosition: (item: OrderProductItem) => void;
  onDeletePosition: (item: OrderProductItem) => void;
};

const CartListProducts: React.FC<CartListProductsProps> = ({
  order,
  changeElementVariant,
  onIncrementPosition,
  onDecrementPosition,
  onDeletePosition,
}) => {
  const getPrice = (elements: OrderProductElement[]) => {
    const e = elements.find((el) => el.active === true);
    const price = e?.prices?.items?.find((p) => p.quantity_from === null);
    if (!price) throw Error("Ошибка получения цены");
    if (price.discount_price) {
      return {
        price: price.discount_price,
        sale: `${price.discount_value_percents}%`,
      };
    }
    return { price: price.price, sale: null };
  };
  let arr = [];
  const getSort = (elements: OrderProductElement[], key: number) => {
    if (elements.length === 1) return null;
    return elements.map((item, index) => {
      return item.properties?.map((p) => {
        if (!ProductProps[p.property_id] || item.item.available === "N" || !p.value) return null;
        return (
            <button
                onClick={() =>
                    changeElementVariant(order.items[key].item, index)
                }
                style={{
                  color: item.active ? "#41ca41" : "#000",
                  float: "left",
                  margin: "auto",
                }}
            >
              {p.value}
            </button>
        );
      });
    });
  };
  for (let key in order.items) {
    const price = getPrice(order.items[key].item.elements);
    arr.push(
      <React.Fragment key={key}>
        <Banner
          key={key}
          before={
            <Avatar
              size={80}
              mode="image"
              src={order.items[key].item.image_url || undefined}
            />
          }
          header={order.items[key].item.name}
          subheader={`${price.price} руб ${price.sale ? price.sale : ""}`}
          asideMode="dismiss"
          actions={
            <>
              <div style={{ display: "flex" }}>
                {getSort(order.items[key].item.elements, Number(key))}
              </div>
              <div style={{ display: "flex", bottom: 0 }}>
                <Button
                  mode={"overlay_outline"}
                  onClick={() => onDecrementPosition(order.items[key].item)}
                  size={"m"}
                  style={{ float: "left", margin: 5, color: "#482d06" }}
                >
                  -1
                </Button>
                <span
                  style={{ margin: "auto", fontSize: 25, fontWeight: "bold" }}
                >
                  {order.items[key].count}
                </span>
                <Button
                  mode={"overlay_outline"}
                  onClick={() => onIncrementPosition(order.items[key].item)}
                  size={"m"}
                  style={{ float: "left", margin: 5, color: "#482d06" }}
                >
                  +1
                </Button>
              </div>
            </>
          }
          onDismiss={() => onDeletePosition(order.items[key].item)}
        />
        <Separator />
      </React.Fragment>
    );
  }
  return <div>{arr}</div>;
};
export default CartListProducts;
