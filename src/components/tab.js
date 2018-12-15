import React,{Component} from "react"
import {Tab} from "semantic-ui-react"
import AllFundingTab from "./all/tab"
import CreatorFundingTab from "./creator/tab"
import InvestorFundingTab from "./investor/tab";

const panes=[
    {menuItem:"All",render:() => <Tab.Pane><AllFundingTab/></Tab.Pane>},
    {menuItem:"My Creation",render:() => <Tab.Pane><CreatorFundingTab/></Tab.Pane>},
    {menuItem:"My Participation",render:() => <Tab.Pane><InvestorFundingTab/></Tab.Pane>}
]

const TabCenter=() => <Tab panes={panes}/>
export default TabCenter