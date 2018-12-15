import React, { Component } from 'react';
import TabCenter from "./components/tab";
import web3 from "./utils/initweb3"

class App extends Component {
    constructor() {
        super()
        this.state={}
    }

    async componentDidMount() {
        try {
            let accounts=await web3.eth.getAccounts()
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
