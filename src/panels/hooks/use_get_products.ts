import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {Category, Product, ReduxState} from "../../types";

type UseGetProdProps = {
    products: Product[] | null,
    targetCat: Category | null,
    categories: Category[] | null,
    changeFilter: (id: number) => void,
    fil: number[],
}
const useGetProducts: () => UseGetProdProps = () => {
    const categories = useSelector((state: ReduxState) => state.categories);
    const targetCat = useSelector((state: ReduxState) => state.targetCategory);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [fil, setFil] = useState<number[]>([]);

    const getFil = useMemo(() => {
        if (!targetCat) return;
        if (fil.length === 0)
            return (
                categories?.filter((cat) => cat.parent_id === targetCat.id)
                    .map((item) => String(item.id))
                    .join(",") +
                "," +
                targetCat.id
            );
        return fil.join(",");
    }, [fil, targetCat, categories]);

    useEffect(() => {
        const get_items = async () => {
            const response = await fetch(
                "https://zoomagasin.ru/api/api.php?route=list&section_ids=" + getFil
            );
            const res: {items: Product[] | null} | null = await response.json();
            if (!res || !res.items) return;
            if (typeof res !== "undefined") {
                //фильруем только доступные
                setProducts(res.items.filter(item=>item.available === "Y"));
            }
        };
        get_items();
    }, [fil, getFil]);

    const changeFilter = (id: number) => {
        let arr = [...fil];
        const index = arr.indexOf(id);
        if (index > -1) {
            arr.splice(index, 1);
        } else {
            arr.push(id);
        }
        setFil(arr);
    };

    return {
        products,
        targetCat,
        categories,
        changeFilter,
        fil,
    };
};
export { useGetProducts };
