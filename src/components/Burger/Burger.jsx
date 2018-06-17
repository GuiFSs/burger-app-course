import React from 'react';
import classes from './Burger.css';
import BurgerIngridient from'./BurgerIngredient/BurgerIngredient';

const Burger = (props) => {
    // transform the ingredients object, into array, just with the keys
    let transformedIngredients = Object.keys(props.ingredients)
        .map((igKey) => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngridient key={igKey + i} type={igKey} />
            });
        }).reduce((prev, next) => {
            return prev.concat(next)
        }, []);

    if (transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding Ingredients</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngridient type="bread-top" />
                {transformedIngredients}
            <BurgerIngridient type="bread-bottom" />
        </div>
    );
};

export default Burger;