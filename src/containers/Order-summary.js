import React from 'react';
import {
    Container,
    Dimmer,
    Header,
    Icon,
    Image,
    Label,
    Loader,
    Table,
    Button,
    Message,
    Menu,
    Segment,
    TableCell
} from "semantic-ui-react";
import { authAxios } from "../utils";
import { addToCartURL, oderSummaryURL, orderItemDeleteURL, orderItemUpdateQuantityURL } from "../constants";
import { Link } from 'react-router-dom';
class OrderSummary extends React.Component {

    state = {
        data: null,
        error: null,
        loading: false,
    }


    handleAddToCart = slug => {
        this.setState({ loading: true });
        authAxios
            .post(addToCartURL, { slug })
            .then(res => {
                this.handelfetchorder();
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
                console.log(err);
            });
    };

    handelfetchorder = () => {
        this.setState({ loading: true })
        authAxios
            .get(oderSummaryURL)
            .then(res => {
                this.setState({ data: res.data, loading: false });
            })
            .catch(err => {
                if (err.response.status === 404) {
                    console.log(err.response);
                    this.setState({ error: "you currently do not have an order", loading: false });
                }
                else {
                    this.setState({ error: err, loading: false });
                }
            });
    }

    componentDidMount() {
        this.handelfetchorder();

    }

    handleDeleteOrder = itemid => {
        authAxios
            .delete(orderItemDeleteURL(itemid))
            .then(res => {
                this.handelfetchorder();
            })
            .catch(err => {
                this.setState({ error: err });
            });
    }

    handleRemoveQuantityFromCart = slug => {
        authAxios
            .post(orderItemUpdateQuantityURL, { slug })
            .then(res => {
                this.handelfetchorder();
            })
            .catch(err => {
                this.setState({ error: err });
                console.log(err);
            });
    };


    render() {
        const { data, error, loading } = this.state;
        console.log(data);
        return (
            <Container>
                <Header as='h3' textAlign="center"> Order Summary</Header>
                {error && (
                    <Message
                        error
                        header="There was some errors with your submission"
                        content={JSON.stringify(error)}

                    />

                )}
                {data && <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Item Name</Table.HeaderCell>
                            <Table.HeaderCell>Item Price</Table.HeaderCell>
                            <Table.HeaderCell>Item Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Total Item Price</Table.HeaderCell>
                            <Table.HeaderCell>Delete Order</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {data.order_items.map((order_item, i) => {
                            return (
                                <Table.Row key={order_item.id}>
                                    <Table.Cell>
                                        <Label ribbon>{i + 1}</Label>
                                    </Table.Cell>
                                    <Table.Cell>{order_item.item}</Table.Cell>
                                    <Table.Cell>
                                        {order_item.item_obj.discount_price ?
                                            <>
                                                {order_item.item_obj.discount_price}</>
                                            :
                                            <>  {order_item.item_obj.price}</>
                                        }

                                    </Table.Cell>


                                    <Table.Cell textAlign="center">
                                        <Icon name="chevron left" onClick={() => this.handleRemoveQuantityFromCart(order_item.item_obj.slug)} />
                                        {order_item.quantity}
                                        <Icon name="chevron right" style={{ marginLeft: '5px' }} onClick={() => this.handleAddToCart(order_item.item_obj.slug)} />
                                    </Table.Cell>


                                    <Table.Cell>
                                        {order_item.item_obj.discount_price && (
                                            <Label ribbon color="green">ON DISCOUNT</Label>
                                        )}
                                        Rs.{order_item.final_price}

                                    </Table.Cell>
                                    <TableCell textAlign="center" >
                                        <Icon name="trash" color="red" onClick={() => this.handleDeleteOrder(order_item.id)}></Icon>
                                    </TableCell>
                                </Table.Row>
                            )
                        })}
                        <Table.Row>
                            <Table.Cell />
                            <Table.Cell />
                            <Table.Cell />
                            <TableCell />
                            <Table.Cell colSpan='1' textAlign="center">
                                Total:Rs {data.total}
                            </Table.Cell>
                            <TableCell />
                        </Table.Row>

                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='6' textAlign="right">
                                <Link to="/checkout"> <Button color="twitter"  >Cheakout</Button></Link>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                }
            </Container>
        );
    }
}
export default OrderSummary;