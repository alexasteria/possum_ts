import React from "react";
import {
    Button,
    Caption,
    Card,
    CardGrid,
    MiniInfoCell,
    Spinner,
    Title,
} from "@vkontakte/vkui";
import { useGetProducts } from "../../hooks/use_get_products";
import {Product, ProductElement} from "../../../types";
export const ProductProps: {[key: number]: {title: string, m?: string}} = {
    31: { title: "Цвет" },
    35: { title: "Вес", m: "гр" },
    42: { title: "Вкус" },
    43: { title: "Диаметр", m: "см" },
};

export const getStaticPrice: (element: ProductElement) => {price: number, sale: null | string} = (element) => {
    const price = element.prices.items?.find(p=>p.quantity_from === null);
    if (price?.discount_price){
        return {price: price.discount_price, sale: `Скидка ${price.discount_value_percents}%`}
    }
    if (!price) throw Error("Ошибка получения цены")
    return {price: price.price, sale: null}
}

export const getElements = (elements: ProductElement[] | null) => {
    if (!elements) return null;
    if (elements.length === 1) {
        const price = getStaticPrice(elements[0])
        return (
            <MiniInfoCell
                after={`${price.price} руб ${price.sale ? price.sale : ""}`}
                style={{ color: "#FFF" }}
                before={null}
            >
                Цена
            </MiniInfoCell>
        );
    }
    return elements.map((item) => {
        return item.properties?.map((p) => {
            if (ProductProps[p.property_id]) {
                const price = getStaticPrice(item)
                if (item.item && item.item.available !== "N" && p.value !== null) return (
                    <MiniInfoCell
                        before={ProductProps[p.property_id].title}
                        after={`${price.price} руб ${price.sale ? price.sale : ""}`}
                        style={{ color: "#FFF" }}
                    >
                        {p.value}
                    </MiniInfoCell>
                );
            }
        });
    });
};

type ProductGridProps = {
    setActiveItem: (item: Product) => void,
    go: (panel: string) => void
}

const ProductsGrid: React.FC<ProductGridProps> = ({ setActiveItem, go }) => {
    const {
        products,
        categories,
        targetCat,
    } = useGetProducts();
    if (!products || !categories || !targetCat) return <Spinner />;
    return (
        <>
            {/*//Вырезаем фильтра*/}
            {/*<HorizontalScroll>*/}
            {/*    <Tabs>*/}
            {/*        {categories.map((cat) => {*/}
            {/*            if (cat.parent_id === targetCat.id)*/}
            {/*                return (*/}
            {/*                    <TabsItem*/}
            {/*                        key={cat.id}*/}
            {/*                        selected={fil.includes(cat.id)}*/}
            {/*                        onClick={() => changeFilter(cat.id)}*/}
            {/*                    >*/}
            {/*                        {cat.name}*/}
            {/*                    </TabsItem>*/}
            {/*                );*/}
            {/*            if (cat.id === targetCat.id)*/}
            {/*                return (*/}
            {/*                    <TabsItem*/}
            {/*                        key={targetCat.id}*/}
            {/*                        selected={fil.includes(cat.id)}*/}
            {/*                        onClick={() => changeFilter(cat.id)}*/}
            {/*                    >*/}
            {/*                        {cat.name}*/}
            {/*                    </TabsItem>*/}
            {/*                );*/}
            {/*            return null;*/}
            {/*        })}*/}
            {/*    </Tabs>*/}
            {/*</HorizontalScroll>*/}
            <CardGrid style={{ marginTop: 10 }}>
                {products.map((item) => {
                    if (item.elements && !item.elements[0].prices.items) {
                        console.log(item)
                        return;
                    }
                    return (
                        <Card
                            key={item.id}
                            style={{
                                paddingTop: 8,
                                borderRadius: 13,
                                margin: "0 0 20px 0",
                                backgroundColor: "#007151",
                                boxShadow:
                                    "inset 2px 2px 5px rgb(226 191 157 / 50%), 1px 1px 5px rgb(255 255 255)",
                            }}
                            size="l"
                            mode="shadow"
                        >
                            <div
                                onClick={() => {
                                    setActiveItem(item);
                                    go("aboutProduct");
                                }}
                                style={{
                                    height: 250,
                                    backgroundImage: item.image_url ? "url(" + item.image_url + ")" : undefined,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center 35%",
                                    backgroundRepeat: "no-repeat",
                                    borderRadius: 13,
                                }}
                            />
                            <MiniInfoCell textWrap="full" before={null}>
                                <Title level="1" weight="regular">{item.name}</Title>
                            </MiniInfoCell>
                            <MiniInfoCell textWrap={"nowrap"} before={null}>
                                <Caption level="3" weight="regular">{item.detail}</Caption>
                            </MiniInfoCell>
                            {getElements(item.elements)}
                            <MiniInfoCell before={null}>
                                <Button
                                    onClick={() => {
                                        setActiveItem(item);
                                        go("aboutItem");
                                    }}
                                    size="m"
                                    stretched
                                    mode="outline"
                                >
                                    Подробнее
                                </Button>
                            </MiniInfoCell>
                        </Card>
                    );
                })}
            </CardGrid>
        </>
    );
};
export default ProductsGrid;
