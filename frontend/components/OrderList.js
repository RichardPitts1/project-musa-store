import React from 'react';
import gql from 'graphql-tag';
import structureMonies from '../lib/structureMonies';
import Link from 'next/link';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { formatDistance } from 'date-fns';
// import Error from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';

const OrderUl = styled.ul`
  /* border: 1px solid ${props => props.theme.black};
  box-shadow: 0 0 76px 24px rgba(1, 10, 0, 0.9); */
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
    display: grid;
    grid-gap: 4rem;
`;

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
            items {
                id
                title
                price
                description
                quantity
                image
            }
        }
    }
`;

class OrderList extends React.Component {
    render() {
        return <Query query={USER_ORDERS_QUERY}>
            {({ data: { orders }, loading, error}) => {
                if(loading) return <p> Loading... 🤸‍</p>
                if(error) return <Error error={error}/>
                console.log(orders);
                return (
                    <div>
                        <h2>You have {orders.length} orders</h2>
                        <OrderUl>
                            {orders.map(order=> (
                                <OrderItemStyles key={order.id}>
                                    <Link href={{
                                        pathName: '/order',
                                        query: { id: order.id }
                                    }}>
                                        <a>
                                           <div className="order-meta">
                                               {/* So this tells you how many items in each order.  Bug though...*/}
                                              {/* <p>{order.items.reduce((x,y) => x + y.quantity), 0} Items in order</p> */}
                                              <p> {formatDistance(order.createdAt, new Date())}</p>
                                              <p>{structureMonies(order.total)}</p>
                                           </div>
                                           <div className="image">
                                               {/* {order.items.map(item => (
                                               <img key={item.id} src={item.image} alt={item.title} />
                                               ))} */}
                                           </div>
                                        </a>
                                    </Link>
                                </OrderItemStyles>
                            ))}
                        </OrderUl>
                    </div>
                )
            }}
            </Query>
    }
}

export default OrderList;