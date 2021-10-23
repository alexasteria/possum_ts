import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  CardGrid,
  Card,
  Div,
  InfoRow,
  Input,
  Select,
  Button,
  MiniInfoCell,
  Group,
} from "@vkontakte/vkui";
import React from "react";
import { UserInfo } from "@vkontakte/vk-bridge";
import { useGetOrders } from "./use_get_orders";
import { SuccessOrder } from "../../types";
import moment from "moment";

const getItem = (order: SuccessOrder["jsonParams"]["order"]) => {
  const jsxArr = [];
  for (let key in order) {
    jsxArr.push(
      <MiniInfoCell before={null} key={key} textWrap="full">
        {order[key]}
      </MiniInfoCell>
    );
  }
  return jsxArr;
};

const getItemVal = (key: string, value: string) => {
  switch (key) {
    case "activePVZ":
      return <InfoRow header="Пункт выдачи">{value}</InfoRow>;
    case "amount":
      return <InfoRow header="Сумма заказа">{value}</InfoRow>;
    case "count":
      return <InfoRow header="Всего товаров">{value}</InfoRow>;
    case "orderNum":
      return <InfoRow header="Номер заказа">{value}</InfoRow>;
    case "date":
      return (
        <InfoRow header="Дата">
          {moment(value).locale("ru").format("MMMM Do YYYY, h:mm:ss a")}
        </InfoRow>
      );
    case "typeDelivery":
      return <InfoRow header="Тип доставки">{value}</InfoRow>;
    case "weight":
      return <InfoRow header="Вес">{Math.round(Number(value))} кг</InfoRow>;
    default:
      return null;
  }
};

const getInfo = (info: SuccessOrder["jsonParams"]["info"]) => {
  const jsxArr = [];
  for (let key in info) {
    jsxArr.push(getItemVal(key, info[key]));
  }
  return jsxArr;
};

type AdminOrdersProps = {
  go: (panel: string) => void;
  id: string;
  fetchedUser: UserInfo | null;
};

const AdminOrders: React.FC<AdminOrdersProps> = ({ go, id, fetchedUser }) => {
  const { arrOrders, changeTrack, changeStatus, changeOrder } = useGetOrders();
  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => go("home")} />} />
      <CardGrid style={{ padding: 10 }}>
        {arrOrders?.map((order) => (
          <Card
            style={{
              paddingTop: 8,
              borderRadius: 13,
              margin: "0 0 20px 0",
              backgroundColor: "#007151",
              boxShadow:
                "inset 2px 2px 5px rgb(226 191 157 / 50%), 1px 1px 5px rgb(255 255 255)",
            }}
            mode="shadow"
            size="l"
          >
            <Div>
              {getItem(order.jsonParams.order)}
              {getInfo(order.jsonParams.info)}
              <InfoRow header="Трек">
                <Input
                  defaultValue={order.track}
                  onChange={(e) => changeTrack(order, e.target.value)}
                />
              </InfoRow>
              {order.jsonParams.contacts && (
                <Group title="Контакты">
                  <InfoRow header="Адрес">
                    {order.jsonParams.contacts.address}
                  </InfoRow>
                  <InfoRow header="Имя">
                    {order.jsonParams.contacts.name}
                  </InfoRow>
                  <InfoRow header="Телефон">
                    {order.jsonParams.contacts.phone}
                  </InfoRow>
                  <InfoRow header="Вконтакте">
                    <a href={"https://vk.com/id" + order.user}>
                      {"https://vk.com/id" + order.user}
                    </a>
                  </InfoRow>
                </Group>
              )}
              <Select
                top="Статус"
                defaultValue={order.status}
                onChange={(e) => changeStatus(order, e.target.value)}
              >
                <option value={"Оплачен"}>Оплачен</option>
                <option value={"Отправлен"}>Отправлен</option>
                <option value={"Отменен"}>Отменен</option>
              </Select>
              <Div>
                <Button
                  size="m"
                  stretched
                  mode="outline"
                  onClick={() => changeOrder(order)}
                >
                  Сохранить
                </Button>
              </Div>
            </Div>
          </Card>
        ))}
      </CardGrid>
    </Panel>
  );
};
export default AdminOrders;
