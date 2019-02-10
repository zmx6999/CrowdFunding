import React, { Component } from 'react';
import TabCenter from "./components/tab";
import {getAccounts} from "./eth/interactions"

class App extends Component {
    constructor() {
        super()
        this.state={}
    }

    async componentDidMount() {
        try {
            let accounts=await getAccounts()
            this.setState({
                currentAccount:accounts[0]
            })
        } catch (e) {

        }
    }

  render() {
    return (
        <div>
            <h1>黑马众筹</h1>
            <img src="https://api.gushi.ci/all.svg" alt="poem"/>
            <p>当前账户: {this.state.currentAccount}</p>
            <TabCenter/>
        </div>
    );
  }
}

export default App;
