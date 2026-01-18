import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import {
  clearConstructor,
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/slices/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearNewOrder,
  createOrder,
  createOrderIsLoadingSelect,
  createOrderSelect
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const constructorItems = {
    bun,
    ingredients: ingredients ?? []
  };

  const orderRequest = useSelector(createOrderIsLoadingSelect);

  const orderModalData = useSelector(createOrderSelect);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
    console.log('Создан заказ:', ingredientIds);
  };

  const closeOrderModal = () => {
    dispatch(clearNewOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  //return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
