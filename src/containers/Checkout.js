import React, { Component } from "react";
import { CardElement, Elements, injectStripe, StripeProvider } from "react-stripe-elements";
import { Table, Form, Icon, Select, Button, Item, Container, Image, Message, Divider, Header, Segment, Dimmer, Loader, Label } from "semantic-ui-react";
import { authAxios } from '../utils';
import { checkoutURL, addCouponURL, countryListURL, oderSummaryURL, AddressURL } from '../constants'
import { Link, withRouter } from "react-router-dom";


const OrderPrivew = (props) => {

    const { data } = props;
    return (
        <React.Fragment>

            {data &&
                <React.Fragment>
                    <Item.Group relaxed>
                        {data.order_items.map((orderItem, i) => {
                            console.log(orderItem);
                            return (
                                <Item key={i}>
                                    <Item.Image size='tiny' src={`http://127.0.0.1:8000${orderItem.item_obj.image}`} />

                                    <Item.Content verticalAlign='middle'>
                                        <Item.Header as='a'>{orderItem.quantity} x {orderItem.item_obj.title}</Item.Header>
                                        <Item.Extra>
                                            <Label>Rs.{orderItem.final_price}</Label>
                                        </Item.Extra>
                                    </Item.Content>
                                </Item>

                                // <Table.Row key={order_item.id}>
                                //     <Table.Cell>
                                //         <Label ribbon>{i + 1}</Label>
                                //     </Table.Cell>
                                //     <Table.Cell>{order_item.item}</Table.Cell>
                                //     <Table.Cell>{order_item.item_obj.price}</Table.Cell>
                                //     <Table.Cell>{order_item.quantity}</Table.Cell>
                                //     <Table.Cell>
                                //         {order_item.item_obj.discount_price && (
                                //             <Label ribbon color="green">ON DISCOUNT</Label>
                                //         )}
                                //     Rs.{order_item.final_price}
                                //     </Table.Cell>
                                // </Table.Row>
                            )

                        })}


                    </Item.Group>

                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Item.Header>Total Price:RS.{data.total}
                                    {data.coupon && (
                                        <Label color="green" style={{ marginLeft: '20px' }}>
                                            Coupon Activated: {data.coupon.code} for Rs. {data.coupon.amount}
                                        </Label>)}
                                </Item.Header>
                            </Item.Content>
                        </Item>

                    </Item.Group>
                </React.Fragment>
            }
        </React.Fragment>
    );

}


class CouponForm extends Component {
    state = {
        code: ""
    };
    handleChange = e => {
        this.setState({
            code: e.target.value
        });
    };
    handleSubmit = e => {
        const { code } = this.state;
        this.props.handleAddCoupon(e, code);
        this.setState({ code: "" });
    };

    render() {
        const { code } = this.state;
        return (
            <React.Fragment>
                {/* onSubmit={this.handleSubmit} */}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field >
                        <label>Coupon code</label>
                        <input
                            placeholder="Enter a coupon.."
                            value={code}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Button type="submit">Submit</Button>
                </Form>
            </React.Fragment>
        );
    }
}


class AddressFetch extends Component {
    state = {
        error: null,
        saving: false,
        success: false,
        address: [],
        formData: {},
        countries: [],
        loading: false,
        userID: null,

    }

    componentDidMount() {
        this.handleFetchAddress();
        this.handleFetchCountries();
    }
    handleFormatCountries = countries => {
        const keys = Object.keys(countries);
        return keys.map(k => {
            return {
                key: k,
                text: countries[k],
                value: k
            };
        });
    };

    handleFetchCountries = () => {
        authAxios
            .get(countryListURL)
            .then(res => {
                this.setState({ countries: this.handleFormatCountries(res.data) });
            })
            .catch(err => {
                this.setState({ error: err });
            });
    };

    handleFetchAddress = () => {
        this.setState({ loading: true })
        authAxios.get(AddressURL)
            .then(res => {
                console.log(res);
                this.setState({ address: res.data, loading: false });

            })
            .catch(err => {
                this.setState({ error: err });
            })
    }
    render() {
        const { error, loading, address, countries, saving, success, formData } = this.state;
        console.log(this.state.countries);
        return (<Container >

            {error && (
                <Message
                    error
                    header="There was some errors with your submission"
                    content={JSON.stringify(error)}
                />
            )}
            {loading && (
                <Segment>
                    <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>
                    <Image src="/images/wireframe/short-paragraph.png" />
                </Segment>
            )}
            {address.map(a => {
                return (
                    <>
                    </>
                    // <div key={a.id}>{a.street_address}</div>

                    // <Table singleLine key={a.id}>
                    //     <Table.Header>
                    //         <Table.Row>
                    //             <Table.HeaderCell>Adress</Table.HeaderCell>
                    //         </Table.Row>
                    //     </Table.Header>

                    //     <Table.Body>
                    //         <Table.Row>
                    //             <Table.Cell>{a.street_address}</Table.Cell>
                    //         </Table.Row>
                    //         <Table.Row>
                    //             <Table.Cell>{a.apartment_address}</Table.Cell>
                    //         </Table.Row>

                    //         <Table.Row>
                    //             <Table.Cell>{a.country}</Table.Cell>
                    //         </Table.Row>

                    //         <Table.Row>

                    //             <Table.Cell>{a.zip}</Table.Cell>
                    //         </Table.Row>
                    //     </Table.Body>
                    // </Table>

                )

            })}
        </Container >
        )
    }
}

class CheckoutForm extends Component {
    state = {
        data: null,
        loading: false,
        success: false,
        error: null,
        address: [],
        countries: [],
    }

    submit = (ev) => {
        console.log(this.state.address[0]['id']);
        ev.preventDefault();
        this.setState({ loading: true });
        if (this.props.stripe) {
            this.props.stripe.createToken().then(result => {
                if (result.error) {
                    this.setState({ error: result.error.message, loading: false });
                }
                else {
                    // add: this.state.address.id

                    authAxios
                        .post(checkoutURL, { stripeToken: result.token.id, id: this.state.address[0]['id'] })
                        .then(res => {
                            console.log(res);
                            this.setState({ loading: false, success: true });
                            //this.props.history.push("/products");
                        })
                        .catch(err => {
                            this.setState({ loading: false, error: err });
                        });

                }
            })
        }
        else {
            console.log("stripe is not loaded")
        }
    }


    componentDidMount() {
        this.handelfetchorder();
        this.handleFetchAddress();
        this.handleFetchCountries();
    }
    handleFormatCountries = countries => {
        const keys = Object.keys(countries);
        return keys.map(k => {
            return {
                key: k,
                text: countries[k],
                value: k
            };
        });
    };

    handleFetchCountries = () => {
        authAxios
            .get(countryListURL)
            .then(res => {
                this.setState({ countries: this.handleFormatCountries(res.data) });
            })
            .catch(err => {
                this.setState({ error: err });
            });
    };
    handleFetchAddress = () => {
        this.setState({ loading: true })
        authAxios.get(AddressURL)
            .then(res => {
                console.log(res);
                this.setState({ address: res.data, loading: false });
                console.log(this.state.address);
            })
            .catch(err => {
                this.setState({ error: err });
            })
    }


    handelfetchorder = () => {
        this.setState({ loading: true })
        authAxios
            .get(oderSummaryURL)
            .then(res => {
                console.log(res);
                this.setState({ data: res.data, loading: false });
            })
            .catch(err => {
                if (err.response.status === 404) {
                    this.props.history.push("/products");
                    console.log(err.response);
                    this.setState({ error: "you currently do not have an order", loading: false });
                }
                else {
                    this.setState({ error: err, loading: false });
                }
            });
    }

    handleAddCoupon = (e, code) => {
        e.preventDefault();
        this.setState({ loading: true });

        authAxios
            .post(addCouponURL, { code })
            .then(res => {
                console.log(res);
                this.setState({ loading: false });
                // this.handleFetchOrder();
                this.handelfetchorder();
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            });
    };

    render() {
        const { error, loading, success, data, address, countries } = this.state;
        console.log(this.state.address);
        return (
            <Container text>
                <div>
                    {error && (
                        <Message
                            error
                            header="There was some errors with your submission"
                            content={JSON.stringify(error)}
                        />
                    )}
                    {loading && (
                        <Segment>
                            <Dimmer active inverted>
                                <Loader inverted>Loading</Loader>
                            </Dimmer>
                            <Image src="/images/wireframe/short-paragraph.png" />
                        </Segment>
                    )}
                    {success && <Message positive>
                        <Message.Header>Your payment was succesfull</Message.Header>
                        <p>
                            Go to your <b>profile</b> to see the order delivery status.
                    </p>
                    </Message>}

                    <OrderPrivew data={data} />
                    <Divider />
                    <CouponForm handleAddCoupon={(e, code) => this.handleAddCoupon(e, code)} />
                    <Divider />
                    {/* <AddressFetch /> */}
                    {address.map(a => {
                        return (
                            // <div key={a.id}>{a.street_address}</div>

                            <Table singleLine key={a.id}>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Adress
                                        <Link to="/Update-Address" > <Button primary style={{ marginLeft: '500px' }} >Udate-Address</Button></Link></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>{a.street_address}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>{a.apartment_address}</Table.Cell>
                                    </Table.Row>

                                    {/* <Table.Row>
                                        <Table.Cell>{a.country}</Table.Cell>
                                    </Table.Row> */}
                                    <Table.Row>
                                        <Form.Field required>
                                            <Select
                                                // loading={countries.length < 1}
                                                fluid
                                                clearable
                                                search
                                                options={countries}
                                                name="country"
                                                placeholder="Country"
                                                // onChange={this.handleSelectChange}
                                                onChange={this.handleSelectChange}
                                                value={a.country}
                                            />
                                        </Form.Field>
                                    </Table.Row>

                                    <Table.Row>

                                        <Table.Cell>{a.zip}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        )
                    })}
                    < Divider />
                    <Header>Payment</Header>
                    <CardElement />
                    {address != '' ?
                        <Button loading={loading} disabled={loading} primary onClick={this.submit} style={{ marginTop: "20px" }}  >Submit</Button>
                        :
                        <>
                            <Message negative>
                                <Message.Header>Please Add your Address first then after continue to payment</Message.Header>
                                <p>
                                    Go to your <b>profile</b> to add-adddress.
                        </p>
                            </Message>
                            <Link to="/profile"> <Button primary style={{ marginTop: "20px" }}  >Add-Address</Button></Link>
                        </>
                    }

                </div>

            </Container>
        );
    }

}

const InjectedForm = withRouter(injectStripe(CheckoutForm));

const wrappeForm = () => (
    <Container>
        <StripeProvider apiKey=" pk_test_51Ibk4KSGafLm2PSq84YA7Kn99WYEANFwxWuLrCJ5R4tZogmUmsfIQ9DV5oATk8MNs3b2gPN2LqrI36LqNYFuEnvf00n84GmYNG" >
            <div >
                <Elements>
                    <InjectedForm />
                </Elements>
            </div>
        </StripeProvider>
    </Container>
)
export default wrappeForm;