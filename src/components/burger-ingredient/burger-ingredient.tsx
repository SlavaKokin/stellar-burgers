import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import {
  addIngredient,
  addBun,
  selectIngredientsCountMap
} from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const countMap = useSelector(selectIngredientsCountMap);
    const count = countMap[ingredient._id] || 0;

    const handleAdd = () => {
      const ingredientWithUuid: TConstructorIngredient = {
        ...ingredient,
        id: uuidv4()
      };
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredientWithUuid));
      } else {
        dispatch(addIngredient(ingredientWithUuid));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
