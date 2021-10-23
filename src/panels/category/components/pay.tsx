import React, { ReactElement, useMemo, useState, useRef } from "react";
import {
  Button,
  Counter,
  Div,
  FormLayout,
  Input,
  MiniInfoCell,
  Snackbar,
  Spinner,
} from "@vkontakte/vkui";
import { useSelector } from "react-redux";
import { Order, OrderProductElement, ReduxState } from "../../../types";
import { DeliveryTypes } from "./delivery";
import { ProductProps } from "./product_grid";
import payImg from "../../../img/pay.png";

const Pay: React.FC<{
  typeDelivery: DeliveryTypes;
  order: Order;
  clearCart: () => void;
}> = ({ typeDelivery, order, clearCart }) => {
  const payRef = useRef(null);
  const [snackbar, setSnackbar] = useState<ReactElement | null>(null);
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [payLink, setPayLink] = useState(null);
  const deliveryInfo = useSelector((state: ReduxState) => state.deliveryInfo);
  const params = useSelector((state: ReduxState) => state.vkParams);
  const dPrice = useMemo(() => {
    if (!deliveryInfo) return 0;
    if (typeDelivery === DeliveryTypes.SDEK) {
      return Math.round(Number(deliveryInfo.sdek.price));
    }
    return Math.round(deliveryInfo.PR.price);
  }, [deliveryInfo, typeDelivery]);
  const dTerm = useMemo(() => {
    if (!deliveryInfo) return "";
    if (typeDelivery === DeliveryTypes.SDEK) {
      return `${deliveryInfo.sdek.deliveryPeriodMin} - ${deliveryInfo.sdek.deliveryPeriodMax} дн.`;
    }
    return deliveryInfo.PR.deliveryDateMax;
  }, [deliveryInfo, typeDelivery]);
  const orderSumWithDelivery = useMemo(() => {
    return order.meta.sum + dPrice;
  }, [dPrice, order]);
  const getElementInfo = (element: OrderProductElement) => {
    return element?.properties
      ?.map((p) => {
        if (ProductProps[p.property_id]) {
          return `${ProductProps[p.property_id].title} - ${p.value}`;
        }
        return "";
      })
      .join("");
  };
  const pay = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    try {
      if (userName === "") throw Error("Не указаны ФИО получателя посылки");
      if (userPhone === "") throw Error("Не указан номер телефона");
      if (userAddress === "") throw Error("Не указан адрес доставки");
      let description = "";
      for (let key in order.items) {
        const e = order.items[key].item.elements.filter(
          (item) => item.active === true
        );
        const aboutItem = getElementInfo(e[0]);
        description =
          description +
          `${order.items[key].item.name}. Штук - ${order.items[key].count}. ${aboutItem}. `;
      }
      const date = Date.now();
      const jsonParams: {
        order?: { [key: number]: string };
        info?: {
          amount: number;
          count: number;
          weight: number;
          typeDelivery: string;
          activePVZ: string;
          orderNum: number;
          date: number;
        };
        contacts?: {
          address: string;
          phone: string;
          name: string;
        };
      } = {};
      const or: { [key: number]: string } = {};
      for (let key in order.items) {
        const e = order.items[key].item.elements.filter(
          (item) => item.active === true
        );
        const aboutItem = getElementInfo(e[0]);
        or[
          key
        ] = `${order.items[key].item.name}. Штук - ${order.items[key].count}. ${aboutItem}`;
      }
      jsonParams.order = or;
      jsonParams.info = {
        amount: order.meta.sum,
        count: order.meta.count,
        weight: order.meta.weight,
        typeDelivery:
          typeDelivery === DeliveryTypes.SDEK ? "Сдэк" : "Почта России",
        activePVZ: "Домой",
        orderNum: date,
        date: date,
      };
      jsonParams.contacts = {
        address: userAddress,
        phone: userPhone,
        name: userName,
      };
      const data = {
        merchant: "57170613-71d8-444e-8b69-8253749eee13",
        amount: String(Math.round(orderSumWithDelivery)),
        custom_order_id: date.toString(),
        description: description.toString(),
        unix_timestamp: String(Math.floor(Date.now() / 1000)).toString(),
        salt: "dPUTLtbMfcTGzkaBnGtseKlcQymCLrYI",
        callback_url:
          "https://saharnypossum.herokuapp.com/pay/modulbankcallback/",
      };
      const orders_success = {
        sum: Math.round(orderSumWithDelivery),
        user: Number(params.vk_user_id),
        num: date,
        jsonParams: jsonParams,
        params: params,
      };
      //saharnypossum.herokuapp.com
      const response = await fetch(
        "https://saharnypossum.herokuapp.com/pay/modulbank",
        {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
          referrer: "no-referrer",
          body: JSON.stringify({
            order: orders_success,
            payData: data,
          }),
        }
      );
      const result = await response.json();
      if (!result) throw Error("Ошибка получения информации от банка");
      if (result.error) {
        setSnackbar(
          <Snackbar onClose={() => setSnackbar(null)}>{result.error}</Snackbar>
        );
      }
      setPayLink(result.paylink);
    } catch (e) {
      setSnackbar(
        <Snackbar layout="vertical" onClose={() => setSnackbar(null)}>
          {(e as Error).message}
        </Snackbar>
      );
    }
  };
  if (!deliveryInfo) return <Spinner />;
  return (
    <div>
      <MiniInfoCell
        before={null}
        style={{ paddingTop: 10 }}
        after={<Counter>{dPrice} руб.</Counter>}
      >
        Стоимость доставки
      </MiniInfoCell>
      <MiniInfoCell before={null} after={dTerm}>
        Срок доставки:
      </MiniInfoCell>
      <MiniInfoCell before={null} after={orderSumWithDelivery}>
        Итого к оплате:{" "}
      </MiniInfoCell>
      <FormLayout>
        <Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          top={"Получатель (ФИО)"}
        />
        <Input
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          top={"Телефон"}
        />
        <Input
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          top={"Адресс (Обл., город, улица, дом, кв.)"}
        />
      </FormLayout>
      <Div>
        {payLink ? (
          <a
            target="_blank"
            ref={payRef}
            id="payLink"
            href={payLink || undefined}
            onClick={clearCart}
            rel="noreferrer"
          >
            <div
              style={{
                textAlign: "center",
                color: "antiquewhite",
                background: "rgb(0 0 0 / 9%)",
                borderRadius: 10,
              }}
            >
              Выберите способ оплаты
              <img
                style={{ width: "100%" }}
                src={payImg}
                alt="Перейти к оплате"
              />
            </div>
          </a>
        ) : (
          <Button onClick={pay} mode={"outline"} size={"xl"}>
            {`Оплатить ${Math.round(orderSumWithDelivery)} руб.`}
          </Button>
        )}
      </Div>
      {snackbar}
    </div>
  );
};
export default Pay;
