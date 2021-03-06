import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders.js';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import classes from './ContactData.css';

import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

class ContactData extends Component {

    state = {
        orderForm: {
            name: this.formConfig('input', 'text' , 'Your Name'),
            street: this.formConfig('input', 'text', 'Street'),
            zipCode: this.formConfig('input', 'text', 'ZIPCODE', '', {
                required: true,
                minLength: 5,
                maxLength: 5
            }),
            coutry: this.formConfig('input', 'text', 'Country'),
            email: this.formConfig('input', 'email', 'Your e-mail'),
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ],
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false,
    }

    formConfig(elementType = 'input', type, placeholder, value = '', validation = {required: true}, touched = false, valid = false) {
        return {
            elementType,
            elementConfig: {
                type,
                placeholder
            },
            value,
            validation,
            valid,
            touched
        };
    }

    orderHandler = (e) => {
        e.preventDefault();
        let formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        };
        this.props.onOrderBurger(order, this.props.token);
    }

    inputChangedHandler = (event, inputIdentifier) => {
            
            const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
                touched: true
            });
            const updatedOrderForm = updateObject(this.state.orderForm, {
                [inputIdentifier]: updatedFormElement
            });

            let formIsValid = true;
            for (let inputIdentifier in updatedOrderForm) {
                formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
            }

            this.setState({orderForm: updatedOrderForm, formIsValid});
        
    } 

    render () {
        const formElementArray = [];
        for (let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler} >
                <h4>Enter your Contact Data</h4>
                {formElementArray.map(formElement => {
                    return (
                        <Input
                            key={formElement.id} 
                            elementType={formElement.config.elementType} 
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(e) => this.inputChangedHandler(e, formElement.id)}    
                        />
                    )
                    
                })}
                <Button btnType="Success" disabled={!this.state.formIsValid} >ORDER</Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                {form}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));