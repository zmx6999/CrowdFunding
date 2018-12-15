import React, { Component } from 'react'
import CardList from "../common/cardlist";
import {Dimmer, Form, Label, Loader, Segment} from "semantic-ui-react"
import {getFundingList,invest} from "../../eth/interactions"
class AllFundingTab extends Component {
    constructor() {
        super()
        this.state={
            selectedFunding:"",
            fundingContracts:[]
        }
    }

    async componentDidMount() {
        try {
            let fundingContracts=await getFundingList()
            if (this.unmount) return
            this.setState({
                fundingContracts
            })
        } catch (e) {
            console.log(e)
        }
    }

    componentWillUnmount() {
        this.unmount=true
    }

    onCardClick=selectedFunding => {
        this.setState({
            selectedFunding
        })
    }

    handleInvest=async() => {
        const {selectedFunding}=this.state
        const {address,supportMoney}=selectedFunding
        this.setState({active:true})
        try {
            await invest(address,supportMoney)
            alert("success")
            window.location.reload(true)
        } catch (e) {
            this.setState({active:false})
            console.log(e)
        }
    }

    render() {
        return (
            <div>
                <div>
                    <h3>参与众筹</h3>
                    <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                        <Dimmer active={this.state.active} inverted>
                            <Loader>支持中</Loader>
                        </Dimmer>
                        <Form onSubmit={this.handleInvest}>
                            <Form.Input type='text' value={this.state.selectedFunding.name || ''} label='项目名称:'/>
                            <Form.Input type='text' value={this.state.selectedFunding.address || ''} label='项目地址:'/>
                            <Form.Input type='text' value={this.state.selectedFunding.supportMoney || ''} label='支持金额:'
                                        labelPosition='left'>
                                <Label basic>￥</Label>
                                <input/>
                            </Form.Input>

                            <Form.Button primary content='参与众筹'/>
                        </Form>
                    </Dimmer.Dimmable>
                </div>
                <CardList details={this.state.fundingContracts} onCardClick={this.onCardClick}/>
            </div>
        )
    }
}
export default AllFundingTab