import React, { Component } from 'react'
import CardList from "../common/cardlist"
import RequestTable from "../common/requestlist"
import {Button} from 'semantic-ui-react'
import {getFundingList,showRequests,approve} from "../../eth/interactions"
class InvestorFundingTab extends Component {
    constructor() {
        super()
        this.state={
            selectedFunding:"",
            requests:[],
            investorFunding:[]
        }
    }

    async componentDidMount() {
        try {
            let investorFunding=await getFundingList(2)
            if (this.unmount) return
            this.setState({
                investorFunding
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

    handleShowRequests=async () => {
        const {selectedFunding}=this.state
        const {address}=selectedFunding
        try {
            let requests=await showRequests(address)
            this.setState({
                requests
            })
        } catch (e) {
            console.log(e)
        }
    }

    handleApprove=async (index) => {
        const {selectedFunding}=this.state
        const {address}=selectedFunding
        try {
            await approve(address,index)
            alert("success")
            window.location.reload(true)
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <div>
                <CardList details={this.state.investorFunding} onCardClick={this.onCardClick}/>
                {
                    this.state.selectedFunding && (
                        <div>
                            <Button onClick={this.handleShowRequests}>申请详情</Button>
                            <RequestTable requests={this.state.requests}
                                          handleApprove={this.handleApprove}
                                          pageKey={3}
                            />
                        </div>
                    )
                }
            </div>
        )
    }
}
export default InvestorFundingTab