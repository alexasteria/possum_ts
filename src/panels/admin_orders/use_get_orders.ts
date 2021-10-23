import { useEffect, useState } from "react";
import { SuccessOrder } from "../../types";

type UseGetOrdersProps = {
  arrOrders: SuccessOrder[] | null;
  changeStatus: (order: SuccessOrder, value: string) => void;
  changeTrack: (order: SuccessOrder, value: string) => void;
  changeOrder: (order: SuccessOrder) => void;
};

const useGetOrders: () => UseGetOrdersProps = () => {
  const [arrOrders, setArrOrders] = useState<SuccessOrder[] | null>(null);
  useEffect(() => {
    fetch("https://saharnypossum.herokuapp.com/pay/orders", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify({}), //
    })
      .then((res) => res.json())
      .then((res) => {
        setArrOrders(res);
      });
  }, []);
  const changeStatus = async (order: SuccessOrder, value: string) => {
    const newArr = await arrOrders?.map((item) => {
      if (item._id === order._id) {
        const newItem = { ...item };
        newItem.status = value;
        return newItem;
      }
      return item;
    });
    setArrOrders(newArr || []);
  };
  const changeTrack = async (order: SuccessOrder, value: string) => {
    const newArr = await arrOrders?.map((item) => {
      if (item._id === order._id) {
        const newItem = { ...item };
        newItem.track = value;
        console.log(newItem);
        return newItem;
      }
      return item;
    });
    setArrOrders(newArr || []);
  };
  const changeOrder = (order: SuccessOrder) => {
    const item = arrOrders?.find((i) => i._id === order._id);
    if (!item) return;
    fetch("https://saharnypossum.herokuapp.com/pay/orders", {
      method: "PATCH", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify({
        _id: item._id,
        status: item.status,
        track: item.track,
        key: ",NbOWn4M_2pKBccO",
      }), // body data type must match "Content-Type" header
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };
  return {
    arrOrders,
    changeStatus,
    changeTrack,
    changeOrder,
  };
};
export { useGetOrders };
