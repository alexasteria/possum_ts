import React, {useCallback, useEffect, useState} from "react";
import { ConfigProvider, View } from "@vkontakte/vkui";
import bridge, { UserInfo } from "@vkontakte/vk-bridge";
import { useDispatch } from "react-redux";
import {setCategoriesList, setVkParams} from "./store/actions";
import Home from "./panels/home";
import "@vkontakte/vkui/dist/vkui.css";
import Category from "./panels/category";
import Cart from "./panels/cart/index"
import {Product} from "./types";
import AboutProduct from "./panels/about_product";
import CityList from "./panels/city_list"
import AdminOrders from "./panels/admin_orders";
import moment from "moment";
import UserOrders from "./panels/user_orders";

type AppProps = {
  linkParams: any;
  params: any;
};

const App: React.FC<AppProps> = ({params}) => {
  moment.locale("ru");
  const dispatch = useDispatch();
  const [activePanel, setActivePanel] = useState<string>("home");
  const [popout, setPopout] = useState(null);
  const [history, setHistory] = useState<string[]>(["home"]);
  const [fetchedUser, setUser] = useState<UserInfo | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  useEffect(()=>{
    dispatch(setVkParams(params))
  },[dispatch, params])
  const go = useCallback((panelName: string) => {
    const hist = [...history];
    hist.push(panelName);
    setHistory(hist);
    setActivePanel(panelName);
  },[history])

  const goBack = useCallback(() => {
    const hist = [...history];
    if (hist.length === 1) {
      bridge.send("VKWebAppClose", { status: "success" });
    } else {
      hist.pop();
      setHistory(hist);
      setActivePanel(hist[hist.length - 1]);
    }
  },[history])
  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send("VKWebAppGetUserInfo");
      setUser(user);
      setPopout(null);
    }
    async function getCat() {
      const response = await fetch(
        "https://zoomagasin.ru/api/api.php?route=sections"
      );
      const res = await response.json();
      dispatch(setCategoriesList(res.items));
    }
    fetchData();
    getCat();
    window.onpopstate = () => {
      goBack();
    };
  }, [dispatch, goBack]);
  return (
    <ConfigProvider>
      <View activePanel={activePanel} popout={popout} history={history}>
        <Home id="home" go={go} fetchedUser={fetchedUser} />
        <Category id="category" go={go} setActiveProduct={setActiveProduct}/>
        <AboutProduct id="aboutProduct" go={go} activeItem={activeProduct}/>
        <Cart id="cart" go={go} goBack={goBack}/>
        <CityList id="cityList" goBack={goBack}/>
        <AdminOrders go={go} id="adminOrders" fetchedUser={fetchedUser}/>
        <UserOrders id="userOrders" goBack={goBack}/>
      </View>
    </ConfigProvider>
  );
};

export default App;
