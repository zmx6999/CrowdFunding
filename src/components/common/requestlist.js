import React from 'react'
import {Table,Button} from 'semantic-ui-react'
import web3 from "../../utils/initweb3"

const RequestTable = (props) => {
    const {requests,pageKey,investorCount,handleFinalize,handleApprove}=props
    let cells=requests.map((request,k)=>{
        let {0:purpose,1:to,2:cost,3:approvedCount,4:status,5:approved}=request
        let complete=status==1
        return (
            <Table.Row key={k}>
                <Table.Cell>{purpose}</Table.Cell>
                <Table.Cell>{web3.utils.fromWei(cost,"ether")} ether</Table.Cell>
                <Table.Cell>{to}</Table.Cell>
                <Table.Cell>{approvedCount}</Table.Cell>
                <Table.Cell>{complete?"Complete":"Voting"}</Table.Cell>
                <Table.Cell>
                    {
                        pageKey==2?<Button disabled={complete || approvedCount*2<investorCount} onClick={() => handleFinalize && handleFinalize(k)}>Pay</Button>:<Button disabled={complete || approved} onClick={() => handleApprove && handleApprove(k)}>Approve</Button>
                    }
                </Table.Cell>
            </Table.Row>
        )
    })
    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>花费描述</Table.HeaderCell>
                    <Table.HeaderCell>花费金额</Table.HeaderCell>
                    <Table.HeaderCell>商家地址</Table.HeaderCell>
                    <Table.HeaderCell>当前赞成人数</Table.HeaderCell>
                    <Table.HeaderCell>当前状态</Table.HeaderCell>
                    <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {cells}
            </Table.Body>
        </Table>
    )
}
export default RequestTable
