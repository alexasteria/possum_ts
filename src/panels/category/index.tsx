import React, { ReactElement, useEffect, useState } from "react";
import {
  Header,
  Placeholder,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  MiniInfoCell,
  Div,
  Link,
  Group,
  Footer,
  Snackbar,
} from "@vkontakte/vkui";
import Icon24Phone from "@vkontakte/icons/dist/24/phone";
import Icon24LogoVk from "@vkontakte/icons/dist/24/logo_vk";
import Icon24Linked from "@vkontakte/icons/dist/24/linked";
//import CartLine from "./components/CartLine";
import mess from "../../img/mess.png";
import { useCart } from "../hooks/use_cart";
//import { getImg } from "./Home";
import { useSelector } from "react-redux";
import ProductsGrid from "./components/product_grid";
import { ReduxState } from "../../types";
import "../style.css"

export const getImg = (id: number) => {
    switch (id) {
        case 1:
            return "https://zoomagasin.ru/images/im-ej-logo.png";
        case 19:
            return "https://zoomagasin.ru/images/im-possum-logo.png";
        case 23:
            return "https://zoomagasin.ru/images/im-rept-logo.png";
        case 27:
            return "https://zoomagasin.ru/images/im-nasek-logo.png";
        default:
            return "https://zoomagasin.ru/images/im-drug-logo.png";
    }
};

type CategoryProps = {
    id: string;
    go: (panel: string) => void;
    setActiveProduct: (v: any) => void;
};

const Category: React.FC<CategoryProps> = ({ id, go, setActiveProduct }) => {
  const [snackbar, setSnackbar] = useState<ReactElement | null>(null);
  const {  message } = useCart();
  useEffect(() => {
    if (!message) return;
    setSnackbar(
      <Snackbar layout="vertical" onClose={() => setSnackbar(null)}>
        {message}
      </Snackbar>
    );
  }, [message]);
  const targetCat = useSelector((state: ReduxState) => state.targetCategory);
  if (!targetCat) return null;
  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => go("home")} />} />
      {/*{order !== null && <CartLine go={go} order={order} />}*/}
      <Placeholder
        icon={
          <div
            style={{
              marginTop: 50,
              background: "url(" + getImg(targetCat.id) + ") no-repeat",
              height: 50,
              width: 50,
            }}
          />
        }
      >
        Выбрана категория: {targetCat.name}
      </Placeholder>
      <Div>
        <ProductsGrid setActiveItem={setActiveProduct} go={go} />
      </Div>
      <Group header={<Header mode="secondary">Есть вопросы?</Header>}>
        <MiniInfoCell
          after={<img width={40} height={22} src={mess} alt="Viber/WhatsApp" />}
          before={<Icon24Phone height={20} width={20} />}
        >
          <Link href="tel:+79022954808" target="_blank">
            +7 (902) 294-48-08
          </Link>
        </MiniInfoCell>
        <MiniInfoCell before={<Icon24LogoVk height={20} width={20} />}>
          <Link href="https://vk.com/zoomagasin" target="_blank">
            vk.com/zoomagasin
          </Link>
        </MiniInfoCell>
        <MiniInfoCell before={<Icon24Linked height={20} width={20} />}>
          <Link href="https://zoomagasin.ru/" target="_blank">
            zoomagasin.ru
          </Link>
        </MiniInfoCell>
        <Footer />
      </Group>
      {snackbar}
    </Panel>
  );
};

export default Category;
