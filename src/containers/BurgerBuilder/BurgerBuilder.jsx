import React, { Component, Fragment } from 'react';
import Burger from '../../components/Burger/Burger.jsx';
import BuildControls from '../../components/Burger/BuildControls/BuildControls.jsx';
import Modal from '../../components/UI/Modal/Modal.jsx';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary.jsx';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

import { connect } from 'react-redux';



class BurgerBuilder extends Component {
   
    state = {
        purchasing: false,
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }


    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey]
        }).reduce((sum, elem) => {
            return sum + elem;
        }, 0);
        return sum > 0;
    }


    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinuelHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for  (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <=0
        }
        
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be show</p>  : <Spinner />

        if (this.props.ings){
            burger = 
                <Fragment >
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                    />
                </Fragment>;
            orderSummary = 
            <OrderSummary 
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinuelHandler} 
                ingredients={this.props.ings}
                price={this.props.price}
            />;
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));