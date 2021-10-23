import React from "react";
import bridge, {UserInfo} from "@vkontakte/vk-bridge";
import {
    Header,
    Link,
    Banner,
    Panel,
    PanelHeader,
    Group,
    Div,
    MiniInfoCell,
    Footer,
    Button,
} from "@vkontakte/vkui";
import "../style.css";
import CartLine from "./components/cart_line";
import Icon16Chevron from "@vkontakte/icons/dist/16/chevron";
import Icon24Phone from "@vkontakte/icons/dist/24/phone";
import Icon24LogoVk from "@vkontakte/icons/dist/24/logo_vk";
import Icon24Linked from "@vkontakte/icons/dist/24/linked";
import mess from "../../img/mess.png";
import { useDispatch, useSelector } from "react-redux";
import { setTargetCategory } from "../../store/actions";
import {ReduxState} from "../../types";
import {useCart} from "../hooks/use_cart";
const addToCommunity = async () => {
    await bridge
        .send("VKWebAppAddToCommunity", {})
        .then((data) => console.log(data));
};

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
type HomeProps = {
    id: string,
    go: (panel: string) => void,
    fetchedUser: UserInfo | null,
}

const Home:React.FC<HomeProps>= ({ id, go, fetchedUser }) => {
    const {order} = useCart()
    const dispatch = useDispatch();
    const categories = useSelector((state: ReduxState) => state.categories);
    if (!categories) return null;
    return (
        <Panel id={id}>
            <PanelHeader />
            <CartLine go={go} order={order}/>
            <Group
                style={{ paddingTop: 50 }}
                header={<Header mode="secondary">Почему мы?</Header>}
            >
                <Div>
                    <MiniInfoCell before={<Icon16Chevron />}>
                        У нас работают специалисты
                    </MiniInfoCell>
                    <MiniInfoCell textLevel={"primary"} before={<Icon16Chevron />}>
                        Более 5 лет успешной работы
                    </MiniInfoCell>
                    <MiniInfoCell textLevel={"primary"} before={<Icon16Chevron />}>
                        Более 1 000 покупателей
                    </MiniInfoCell>
                    <MiniInfoCell textLevel={"primary"} before={<Icon16Chevron />}>
                        Входим в ассоциации врачей
                    </MiniInfoCell>
                    <MiniInfoCell textLevel={"primary"} before={<Icon16Chevron />}>
                        Собственное производство
                    </MiniInfoCell>
                    <MiniInfoCell textLevel={"primary"} before={<Icon16Chevron />}>
                        Контроль качеств
                    </MiniInfoCell>
                </Div>
            </Group>
            <Group header={<Header mode="secondary">Категории товаров</Header>}>
                {categories.map(
                    (cat) =>
                        cat.parent_id === null && (
                            <Banner
                                key={cat.id}
                                id={String(cat.id)}
                                onClick={() => {
                                    dispatch(setTargetCategory(cat));
                                    go("category");
                                }}
                                mode="image"
                                header={cat.name}
                                asideMode={"expand"}
                                subheader={cat.description}
                                background={
                                    <div
                                        style={{
                                            backgroundColor: "#198662",
                                            backgroundImage: "url(" + getImg(cat.id) + ")",
                                            backgroundPosition: "98% 95%",
                                            backgroundSize: 50,
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    />
                                }
                            />
                        )
                )}
            </Group>
            <Group header={<Header mode="secondary">Есть вопросы?</Header>}>
                <MiniInfoCell
                    after={<img width={40} height={22} src={mess} alt="Viber/WhatsApp" />}
                    before={<Icon24Phone fill={"#FFF"} height={20} width={20} />}
                >
                    <Link href="tel:+79022954808" target="_blank">
                        +7 (902) 294-48-08
                    </Link>
                </MiniInfoCell>
                <MiniInfoCell
                    before={<Icon24LogoVk fill={"#FFF"} height={20} width={20} />}
                >
                    <Link href="https://vk.com/zoomagasin" target="_blank">
                        vk.com/zoomagasin
                    </Link>
                </MiniInfoCell>
                <MiniInfoCell
                    before={<Icon24Linked fill={"#FFF"} height={20} width={20} />}
                >
                    <Link href="https://zoomagasin.ru/" target="_blank">
                        zoomagasin.ru
                    </Link>
                </MiniInfoCell>
                <Banner
                    header="Установите в Ваше сообщество"
                    subheader="Если Вы являетесь владельцем сообщества с тематикой, схожей с тематикой нашего магазина - добавьте 'Сахарный поссум' в приложения Вашего сообщества или группы."
                    actions={
                        <Button onClick={addToCommunity}>Установить в сообщество</Button>
                    }
                />
                { fetchedUser && (fetchedUser.id === 199500866 || fetchedUser.id === 15937415) ?
                    <Div>
                        <Button size="l" mode="outline" stretched onClick={()=>go("get_orders")}>Мои заказы</Button>
                    </Div> : null
                }
                <Footer />
            </Group>
        </Panel>
    );
};

export default Home;
