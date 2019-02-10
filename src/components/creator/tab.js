import React, { Component } from 'react'
import CardList from "../common/cardlist"
import RequestTable from "../common/requestlist"
import {Dimmer, Form, Label, Loader, Segment,Button} from "semantic-ui-react"
import {getFundingList,finalizeRequest,getRequestList,createRequest,newFunding} from "../../eth/interactions"
class CreatorFundingTab extends Component {
    constructor() {
        super()
        this.state={
            selectedFunding:"",
            requests:[],
            creatorFunding:[]
        }
    }

    async componentDidMount() {
        try {
            let creatorFunding=await getFundingList(1)
            if (this.unmount) return
            this.setState({
                creatorFunding
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
            let requests=await getRequestList(address)
            this.setState({
                requests
            })
        } catch (e) {
            console.log(e)
        }
    }

    handleFinalize=async (index) => {
        const {selectedFunding}=this.state
        const {address}=selectedFunding
        try {
            await finalizeRequest(address,index)
            alert("success")
            window.location.reload(true)
        } catch (e) {
            console.log(e)
        }
    }

    handleChange=(e,{name,value}) => {
        this.setState({
            [name]:value
        })
    }

    handleCreateRequest=async () => {
        const {selectedFunding,purpose,to,cost}=this.state
        const {address}=selectedFunding
        try {
            await createRequest(address,purpose,to,cost)
            alert("success")
            window.location.reload(true)
        } catch (e) {
            console.log(e)
        }
    }

    handleCreate=async () => {
        const {projectName,supportMoney,targetMoney,duration}=this.state
        this.setState({active:true})
        try {
            await newFunding(projectName,targetMoney,supportMoney,duration)
            alert("success")
            window.location.reload(true)
        } catch (e) {
            console.log(e)
            this.setState({active:false})
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                        <Dimmer active={this.state.active} inverted>
                            <Loader>Loading</Loader>
                        </Dimmer>
                        <Form onSubmit={this.handleCreate}>
                            <Form.Input required type='text' placeholder='项目名称' name='projectName'
                                        value={this.state.projectName} label='项目名称:'
                                        onChange={this.handleChange}/>

                            <Form.Input required type='text' placeholder='支持金额' name='supportMoney'
                                        value={this.state.supportMoney} label='支持金额:'
                                        labelPosition='left'
                                        onChange={this.handleChange}>
                                <Label basic>￥</Label>
                                <input/>
                            </Form.Input>

                            <Form.Input required type='text' placeholder='目标金额' name='targetMoney' value={this.state.targetMoney}
                                        label='目标金额:'
                                        labelPosition='left'
                                        onChange={this.handleChange}>
                                <Label basic>￥</Label>
                                <input/>
                            </Form.Input>
                            <Form.Input required type='text' placeholder='目标金额' name='duration' value={this.state.duration}
                                        label='众筹时间:'
                                        labelPosition='left'
                                        onChange={this.handleChange}>
                                <Label basic>S</Label>
                                <input/>
                            </Form.Input>
                            <Form.Button primary content='创建众筹'/>
                        </Form>
                    </Dimmer.Dimmable>
                </div>
                {
                    this.state.selectedFunding && (
                        <div>
                            <h3>发起付款请求</h3>

                            <Segment>
                                <h4>当前项目:{this.state.selectedFunding.name}, 地址: {this.state.selectedFunding.funding}</h4>
                                <Form onSubmit={this.handleCreateRequest}>
                                    <Form.Input type='text' name='purpose' required value={this.state.purpose}
                                                label='请求描述' placeholder='请求描述' onChange={this.handleChange}/>

                                    <Form.Input type='text' name='cost' required value={this.state.cost}
                                                label='付款金额' labelPosition='left' placeholder='付款金额'
                                                onChange={this.handleChange}>
                                        <Label basic>￥</Label>
                                        <input/>
                                    </Form.Input>

                                    <Form.Input type='text' name='to' required value={this.state.to}
                                                label='商家收款地址' labelPosition='left' placeholder='商家地址'
                                                onChange={this.handleChange}>
                                        <Label basic><span role='img' aria-label='location'>📍</span></Label>
                                        <input/>
                                    </Form.Input>

                                    <Form.Button primary content='开始请求'/>
                                </Form>
                            </Segment>
                        </div>
                    )
                }
                {
                    this.state.selectedFunding && (
                        <div>
                            <Button onClick={this.handleShowRequests}>申请详情</Button>
                            <RequestTable requests={this.state.requests}
                                          handleFinalize={this.handleFinalize}
                                          pageKey={2}
                                          investorCount={this.state.selectedFunding.investorCount}
                            />
                        </div>
                    )
                }
                <CardList details={this.state.creatorFunding} onCardClick={this.onCardClick}/>
            </div>
        )
    }
}
export default CreatorFundingTab
