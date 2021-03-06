import React, { useState, useEffect, ReactElement, useMemo } from "react";
import {
  Placeholder,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Button,
  Footer,
  Cell,
  Snackbar,
  Div,
  MiniInfoCell,
  Counter,
  Group,
  Header,
} from "@vkontakte/vkui";
import "../style.css";
import Icon56ArticleOutline from "@vkontakte/icons/dist/56/article_outline";
import CartListProductsProps from "./components/cart_list_products";
import { useCart } from "../hooks/use_cart";
import { useSelector } from "react-redux";
import { ReduxState } from "../../types";
import Delivery from "../category/components/delivery";
import bridge from "@vkontakte/vk-bridge";

type CartProps = {
  id: string;
  go: (panel: string) => void;
  goBack: () => void;
};

const Cart: React.FC<CartProps> = ({ id, go, goBack }) => {
  const [snackbar, setSnackbar] = useState<ReactElement | null>(null);
  const [access, setAccess] = useState(true);
  const deliveryCity = useSelector((state: ReduxState) => state.deliveryCity);
  const {
    order,
    message,
    changeElementVariant,
    onIncrementPosition,
    onDecrementPosition,
    onDeletePosition,
    clearCart,
  } = useCart();
  const getAccess = async () => {
    const response = await bridge.send("VKWebAppAllowMessagesFromGroup", {
      group_id: 34022993,
      key: "dBuBKe1kFcdemzB",
    });
    if (!response.result) {
      setAccess(false);
    }
    setAccess(response.result);
  };
  useEffect(() => {
    getAccess();
  }, []);
  useEffect(() => {
    if (!message) return;
    setSnackbar(
      <Snackbar layout="vertical" onClose={() => setSnackbar(null)}>
        {message}
      </Snackbar>
    );
  }, [message]);

  if (order.meta.count === 0) {
    return (
      <Panel id={id}>
        <PanelHeader left={<PanelHeaderBack onClick={goBack} />} />
        <Cell expandable onClick={() => go("userOrders")}>
          Оплаченные заказы
        </Cell>
        {!access && (
          <Div>
            <Button align={"center"} onClick={getAccess} stretched>
              Хочу получать трек-код в сообщении
            </Button>
          </Div>
        )}
        <Placeholder
          icon={<Icon56ArticleOutline />}
          header={"Ваша корзина пуста"}
          action={
            <Button onClick={goBack} mode={"outline"} size="l">
              Продолжить покупки
            </Button>
          }
        />
        <Footer />
      </Panel>
    );
  }

  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => go("home")} />} />
      <Cell expandable onClick={() => go("userOrders")}>
        Оплаченные заказы
      </Cell>
      {!access && (
        <Div>
          <Button align={"center"} onClick={getAccess} stretched>
            Хочу получать трек-код в сообщении
          </Button>
        </Div>
      )}
      <CartListProductsProps
        order={order}
        changeElementVariant={changeElementVariant}
        onIncrementPosition={onIncrementPosition}
        onDecrementPosition={onDecrementPosition}
        onDeletePosition={onDeletePosition}
      />
      <>
        <Div>
          <MiniInfoCell
            before={null}
            after={<Counter>{order.meta ? order.meta.count : 0}</Counter>}
          >
            Товаров (штуки)
          </MiniInfoCell>
          <MiniInfoCell
            before={null}
            after={<Counter>{order.meta ? order.meta.sum : 0}</Counter>}
          >
            Сумма (рубли)
          </MiniInfoCell>
        </Div>
        <Group header={<Header mode="secondary">Доставка</Header>}>
          <Cell
            expandable
            onClick={() => go("cityList")}
            indicator={deliveryCity ? deliveryCity.name : "Не выбрано"}
          >
            Город доставки
          </Cell>
          <Delivery order={order} clearCart={clearCart} />
        </Group>
      </>
      <Footer />
      {snackbar}
    </Panel>
  );
};

export default Cart;
