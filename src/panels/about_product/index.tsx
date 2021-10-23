import React, { ReactElement, useEffect, useState } from "react";
import {
  Header,
  Panel,
  PanelHeader,
  Card,
  CardGrid,
  PanelHeaderBack,
  Button,
  MiniInfoCell,
  Div,
  Title,
  Group,
  Footer,
  Snackbar,
} from "@vkontakte/vkui";
import "../style.css";

import CartLine from "../home/components/cart_line";
import { useCart } from "../hooks/use_cart";
import { getElements } from "../category/components/product_grid";
import { Product } from "../../types";

type AboutProductProps = {
  id: string;
  go: (panel: string) => void;
  activeItem: Product | null;
};

const AboutProduct: React.FC<AboutProductProps> = ({ id, go, activeItem }) => {
  const [snackbar, setSnackbar] = useState<ReactElement | null>(null);
  const { onIncrementPosition, message, order } = useCart();
  useEffect(() => {
    if (!message) return;
    setSnackbar(
      <Snackbar layout="vertical" onClose={() => setSnackbar(null)}>
        {message}
      </Snackbar>
    );
  }, [message]);
    if (!activeItem) return null;
  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => go("category")} />} />
      <CartLine go={go} order={order}/>
      <Group
        style={{ paddingTop: 50 }}
        header={<Header mode="secondary">Информация о товаре</Header>}
      >
        {activeItem.image_url && (
          <img
            style={{ width: "100%" }}
            src={activeItem.image_url}
            alt="Фото товара"
          />
        )}
      </Group>
      <Div>
        <CardGrid>
          <Card size="l">
            <MiniInfoCell textWrap={"full"} before={null}>
              <Title level="1" weight="semibold" style={{ marginBottom: 16 }}>
                {activeItem.name}
              </Title>
            </MiniInfoCell>
            {getElements(activeItem.elements)}
            <Button
              size="xl"
              onClick={() => onIncrementPosition(activeItem)}
              mode={"outline"}
            >
              Добавить в корзину
            </Button>
          </Card>
          <Card size="l">
            <Div
              style={{
                backgroundColor: "#03825e",
                borderRadius: 10,
                color: "antiquewhite",
              }}
            >
              {activeItem.detail}
            </Div>
          </Card>
        </CardGrid>
      </Div>
      <Footer />
      {snackbar}
    </Panel>
  );
};

export default AboutProduct;
