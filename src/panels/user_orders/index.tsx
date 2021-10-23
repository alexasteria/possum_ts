import React, { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Cell,
  Footer,
  InfoRow,
  MiniInfoCell,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Placeholder,
  Snackbar,
} from "@vkontakte/vkui";
import {
  Icon20CheckCircleFillGreen,
  Icon56ArticleOutline,
  Icon20CheckCircleFillYellow,
} from "@vkontakte/icons";
import { useSelector } from "react-redux";
import { ReduxState, SuccessOrder } from "../../types";

type UserOrdersProps = {
  id: string;
  goBack: () => void;
};

const UserOrders: React.FC<UserOrdersProps> = ({ id, goBack }) => {
  const params = useSelector((state: ReduxState) => state.vkParams);
  const [snackbar, setSnackbar] = useState<ReactElement | null>(null);
  const [allOrders, setAllOrders] = useState<SuccessOrder[] | null>(null);
  useEffect(() => {
    fetch("https://saharnypossum.herokuapp.com/pay/getAllOrders", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify({ params: params }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setSnackbar(
            <Snackbar layout="vertical" onClose={() => setSnackbar(null)}>
              "Ошибка получения заказов"
            </Snackbar>
          );
        } else {
          setAllOrders(res || []);
        }
      });
  }, [params]);
  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={goBack} />} />
      <OrderList allOrders={allOrders} goBack={goBack} />
      <Footer />
      {snackbar}
    </Panel>
  );
};
export default UserOrders;

const getImg = (status: string) => {
  switch (status) {
    case "Оплачен":
      return <Icon20CheckCircleFillGreen />;
    case "Отправлен":
      return <Icon20CheckCircleFillGreen />;
    default:
      return <Icon20CheckCircleFillYellow />;
  }
};
const getStatus = (status: string) => {
  switch (status) {
    case "В обработке":
      return "Не оплачен";
    default:
      return status;
  }
};

const OrderList: React.FC<{
  allOrders: SuccessOrder[] | null;
  goBack: () => void;
}> = ({ allOrders, goBack }) => {
  if (!allOrders)
    return (
      <Placeholder
        stretched
        icon={<Icon56ArticleOutline />}
        header={"Загрузка"}
      />
    );
  if (allOrders.length === 0)
    return (
      <Placeholder
        stretched
        icon={<Icon56ArticleOutline />}
        header={"У вас нет текущих доставок"}
        action={
          <Button onClick={goBack} mode={"outline"} size="l">
            Продолжить покупки
          </Button>
        }
      />
    );
  return (
    <div>
      {allOrders.map((order, index) => {
        return (
          <Cell
            key={index}
            multiline
            description={
              order.track
                ? "Трек-номер: " + order.track
                : "Заказ еще не отправлен"
            }
          >
            <MiniInfoCell textWrap="full" before={getImg(order.status)}>
              {`[${getStatus(order.status)}] - ` +
                `Заказ №${order.num} (${order.sum}руб.)`}
            </MiniInfoCell>
            {order.jsonParams.order &&
              Object.keys(order.jsonParams.order).map((key, index) => {
                return (
                  <InfoRow header={order.jsonParams.order[Number(key)]} key={index} />
                );
              })}
          </Cell>
        );
      })}
    </div>
  );
};
