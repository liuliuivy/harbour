import React, { Component, Fragment } from 'react';
import axios from 'axios';
import './MainPage.css';

import { Form, FormGroup, FormControl } from 'react-bootstrap';



class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: null,
            accounts: [],
            userInput: '',
            filteredSuggestions: [],
            showSuggestions: false,
            showItem:false
        }
    }
    getData() {
        axios.get('http://dev.presscentric.com/test/accounts')
            .then(
                res => {
                    this.setState({
                        accounts: res.data,
                        isLoaded: true
                    });
                },
                error => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }
    getItems(id){
        axios.get(`http://dev.presscentric.com/test/accounts/${id}`)
            .then(
                res =>{
                    this.setState({
                        item: res.data,
                        showItem:true
                    })
                    
                }

            )
    }
    change = (e) => {
        const { accounts } = this.state;
        const userInput = e.currentTarget.value;
        const filteredSuggestions = accounts.filter(account => (
            account.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        ))

        this.setState({
            userInput: e.currentTarget.value,
            filteredSuggestions,
            showSuggestions: true

        });
    }
    click = (e,id)=> {
        this.setState({
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText,
            showItem:false
        })
        this.getItems(id);


    }
    componentDidMount() {
        this.getData();
    }
    render() {
        const { item,showSuggestions,filteredSuggestions,userInput,showItem } = this.state;
        let suggestionList;
        if(showSuggestions && userInput ){
            if(filteredSuggestions.length>0){
                suggestionList =(
                <ul>
                 {filteredSuggestions.map(suggest =>(
                    <li key={suggest.id} onClick={(e)=>this.click(e,suggest.id)} >
                        {suggest.name}
                    </li>
                ))}
                </ul>
                )}else {
                    suggestionList = (
                        <div>
                         <p>NO MATCH. Do it yourself</p>
                        </div>
                    )
                }
        } 

        let itemDetail;
        if(showItem && !showSuggestions
        ){
            itemDetail =(
            <ul>
             <li>User ID :{item.id}</li>
             <li>User Firstname:{item.nameFirst}</li>
             <li>User Lastname:{item.nameLast}</li>
             <li>User EmaiL:{item.email}</li>
             <li>User Gender:{item.gender}</li>
             <li>User ip:{item.ip}</li>
            </ul>
            )
        }


        return (
            <Fragment>

                <h1>Please insert your info!</h1>

                <Form>
                    <FormGroup>
                        <FormControl className="accountName"
                            type="text"
                            name="accountName"
                            placeholder="your account ID"
                            onChange={this.change}
                            value={this.state.userInput}
                        />
                    </FormGroup>
                </Form>
                {suggestionList}
                {itemDetail}

            </Fragment>
        )

    }

}

export default MainPage;
