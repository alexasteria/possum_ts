import React, { useCallback, useEffect, useState } from "react";
import {
  Cell,
  Footer,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Input,
  Spinner,
  FormLayout,
} from "@vkontakte/vkui";
import { useDispatch } from "react-redux";
import { setDeliveryCity } from "../../store/actions";
import { City } from "../../types";

type CityListProps = {
  id: string;
  goBack: () => void;
};

const CityList: React.FC<CityListProps> = ({ id, goBack }) => {
  const dispatch = useDispatch();
  const [arrCities, setArrCities] = useState<City[]>([]); //города для доставки
  const [nameCity, setNameCity] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const setCity = (city: City) => {
    dispatch(setDeliveryCity(city));
    goBack();
  };
  const find = useCallback(() => {
    setLoading(true);
    const url = "https://sahpossum.herokuapp.com/items/getCities/" + nameCity;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setArrCities(res);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [nameCity]);
  useEffect(() => {
    find();
  }, [find]);
  return (
    <Panel id={id}>
      <PanelHeader left={<PanelHeaderBack onClick={() => goBack()} />} />
      <FormLayout>
        <Input
          top={"Введите полное название города"}
          value={nameCity}
          onChange={(e) => setNameCity(e.target.value)}
        />
      </FormLayout>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {arrCities.map((item) => {
            return (
              <Cell
                multiline
                key={item.id}
                onClick={() => setCity(item)}
                description={item.region || ""}
              >
                {item.name}
              </Cell>
            );
          })}
        </>
      )}
      <Footer />
    </Panel>
  );
};

export default CityList;
