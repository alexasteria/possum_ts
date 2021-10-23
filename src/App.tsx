import React, {useCallback, useEffect, useState} from "react";
import { ConfigProvider, View } from "@vkontakte/vkui";
import bridge, { UserInfo } from "@vkontakte/vk-bridge";
import { useDispatch } from "react-redux";
import { setCategoriesList } from "./store/actions";
import Home from "./panels/home";
import "@vkontakte/vkui/dist/vkui.css";
import Category from "./panels/category";
import {Product} from "./types";
import AboutProduct from "./panels/about_product";

type AppProps = {
  linkParams: any;
  params: any;
};

const App: React.FC<AppProps> = () => {
  const dispatch = useDispatch();
  const [activePanel, setActivePanel] = useState<string>("home");
  const [popout, setPopout] = useState(null);
  const [history, setHistory] = useState<string[]>(["home"]);
  const [fetchedUser, setUser] = useState<UserInfo | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

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
      </View>
    </ConfigProvider>
  );
};

export default App;
