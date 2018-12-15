import React from 'react'
import {Card, Image, List, Progress, Table} from 'semantic-ui-react'
import web3 from "../../utils/initweb3"

const CardList = (props) => {
    const {details,onCardClick}=props
    let cards=details.map((detail,k)=><CardFunding key={k} detail={detail} onCardClick={onCardClick}/>)
    return (
        <Card.Group itemsPerRow={4}>
            {
                cards
            }
        </Card.Group>
    )
}

const CardFunding = (props) => {
    const {detail,onCardClick}=props
    const {name,supportMoney,targetMoney,endTime,investorCount}=detail
    let balance=supportMoney*investorCount
    let percent=(parseFloat(balance)/parseFloat(targetMoney)).toFixed(2)*100
    return (
        <Card onClick={() => onCardClick && onCardClick(detail)}>
            <Image src='/images/000.jpg'/>
            <Card.Content>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>
                    <span className='date'>剩余时间:{endTime}</span>
                    <Progress percent={percent} progress size='small'/>
                </Card.Meta>
                <Card.Description>用过的都说好!</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <List horizontal style={{display: 'flex', justifyContent: 'space-around'}}>
                    <List.Item>
                        <List.Content>
                            <List.Header>已筹</List.Header>
                            {web3.utils.fromWei(balance+"","ether")} ether
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>已达</List.Header>
                            {percent}%
                        </List.Content>
                    </List.Item>
                    <List.Item>
                        <List.Content>
                            <List.Header>参与人数</List.Header>
                            {investorCount}
                        </List.Content>
                    </List.Item>
                </List>
            </Card.Content>
        </Card>
    )
}

export default CardList