import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders.js';
import Spinner from '../../../components/UI/Spinner/Spinner';

import classes from './ContactData.css';

class ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }


    orderHandler = (e) => {
        e.preventDefault();

        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
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
                this.setState({loading: false});
                this.props.history.replace('/');
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }

    render () {
        let form = (
            <form >
                <h4>Enter your Contact Data</h4>
                <input className={classes.Input} type="text" name="name" placeholder="Your name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler} >ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                {form}
            </div>
        );
    }

}

export default ContactData;