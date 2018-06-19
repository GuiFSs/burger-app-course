import React, { Component, Fragment } from 'react';
import Burger from '../../components/Burger/Burger.jsx';
import BuildControls from '../../components/Burger/BuildControls/BuildControls.jsx';
import Modal from '../../components/UI/Modal/Modal.jsx';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary.jsx';
import axios from '../../axios-orders';

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
        purchaseable: false,
        purchasing: false
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

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinuelHandler = () => {
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Guilherme Santos',
                address: {
                    street: 'Rua Teste',
                    zipCode: '2343',
                    coutry: 'Brazil'
                },
                email: 'gui@test.com',
            },
            deliveryMethod: 'faster'
        };
        axios.post('/orders.json', order)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
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
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    <OrderSummary 
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinuelHandler} 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice} />
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchaseable={this.state.purchaseable}
                    ordered={this.purchaseHandler} />
            </Fragment>
        );
    }
}

export default BurgerBuilder;