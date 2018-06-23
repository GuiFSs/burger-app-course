import React, { Component, Fragment } from 'react';
import Burger from '../../components/Burger/Burger.jsx';
import BuildControls from '../../components/Burger/BuildControls/BuildControls.jsx';
import Modal from '../../components/UI/Modal/Modal.jsx';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary.jsx';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
   
    state = {
        ingredients: null,
        totalPrice: 5.70,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    async componentDidMount() {
        try {
            const response = await axios.get('https://react-my-burger-699ec.firebaseio.com/ingredients.json');
            this.setState({ingredients: response.data, purchaseable: true});
        } catch (err) {
            this.setState({error: true});
        }
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
       

        let queryParams = []
        for (let key in this.state.ingredients) {
            queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.state.ingredients[key]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for  (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <=0
        }
        
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be show</p>  : <Spinner />

        if (this.state.ingredients){
            
            burger = 
                <Fragment >
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purchaseHandler}
                    />
                </Fragment>;
            orderSummary = 
            <OrderSummary 
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinuelHandler} 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
            />;
            
        }
        if (this.state.loading){
            orderSummary = <Spinner />
        }
        
        return (
            <Fragment >
                <Modal isLoading={this.state.loading} show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
            </Fragment>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);