import React, { Component, Fragment } from 'react';
import Burger from '../../components/Burger/Burger.jsx';
import BuildControls from '../../components/Burger/BuildControls/BuildControls.jsx'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
   
    state = {
        ingredients: {
            salad: 0,
            cheese: 0,
            bacon: 0,
            meat: 0
        },
        totalPrice: 4,
        purchaseable: false
    }

    updatePurchaseState () {
        
        this.setState(prevState => {
            const ingredients = {...prevState.ingredients};
            const sum = Object.keys(ingredients).map(igKey => {
                return ingredients[igKey]
            }).reduce((sum, elem) => {
                return sum + elem;
            }, 0);

            return {
                purchaseable: sum > 0
            }
        });
        
    }

    addIngredientHandler = (type) => {
        // const updatedCount = this.state.ingredients[type] + 1;
        // const updatedIngredients = {
        //     ...this.state.ingredients
        // };
        // updatedIngredients[type] = updatedCount;
        // const priceAddition = INGREDIENT_PRICES[type];
        // const newPrice = this.state.totalPrice + priceAddition;
        // this.setState({totalPrice: newPrice, ingredients: updatedIngredients});

        this.setState((prevState) => {
            const updatedIngredients = {...prevState.ingredients};
            updatedIngredients[type] += 1;
            return {
                ingredients: updatedIngredients,
                totalPrice: prevState.totalPrice + INGREDIENT_PRICES[type]
            };
        });

        this.updatePurchaseState();

    }

    
    removeIngredientHandler = (type) => {
        this.setState(prevState => {
            const updatedIngredients = {...prevState.ingredients};
            if (updatedIngredients[type] < 0){
                return;
            }
            updatedIngredients[type] -= 1;
            
            return {
                ingredients: updatedIngredients,
                totalPrice: prevState.totalPrice - INGREDIENT_PRICES[type]
            };
        });
        this.updatePurchaseState();
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for  (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <=0
        }
        return (
            <Fragment >
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchaseable={this.state.purchaseable} />
            </Fragment>
        );
    }
}

export default BurgerBuilder;