import React, { useCallback, useEffect, useState } from "react";
import { Div, Tabs, TabsItem } from "@vkontakte/vkui";
import { useDispatch, useSelector } from "react-redux";
import { Order, ReduxState } from "../../../types";
import Pay from "./pay";
import { setDeliveryInfo } from "../../../store/actions";

export enum DeliveryTypes {
  SDEK,
  POST_RUSSIA,
}

const Delivery: React.FC<{ order: Order; clearCart: () => void }> = ({
  order,
  clearCart,
}) => {
  const dispatch = useDispatch();
  const deliveryCity = useSelector((state: ReduxState) => state.deliveryCity);
  const [typeDelivery, setTypeDelivery] = useState<DeliveryTypes>(
    DeliveryTypes.SDEK
  );
  const getRange = useCallback(() => {
    if (!deliveryCity) return;
    fetch("https://saharnypossum.herokuapp.com/items/getRange", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify({
        cityCode: deliveryCity.id,
        weight: String(order.meta.weight),
        count: order.meta.count,
        typeDelivery: "137", // "137" доставка до квартиры
        postal: deliveryCity.postal,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch(setDeliveryInfo(res));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [order.meta, deliveryCity, dispatch]);
  useEffect(() => {
    if (!deliveryCity) return;
    getRange();
  }, [typeDelivery, getRange, deliveryCity]);
  if (!deliveryCity) return null;
  return (
    <Div>
      <Tabs>
        <TabsItem
          onClick={() => setTypeDelivery(DeliveryTypes.SDEK)}
          selected={typeDelivery === DeliveryTypes.SDEK}
        >
          СДЭК
        </TabsItem>
        <TabsItem
          onClick={() => setTypeDelivery(DeliveryTypes.POST_RUSSIA)}
          selected={typeDelivery === DeliveryTypes.POST_RUSSIA}
        >
          Почта России
        </TabsItem>
      </Tabs>
      <Pay typeDelivery={typeDelivery} order={order} clearCart={clearCart}/>
    </Div>
  );
};
export default Delivery;
