
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Message, Icon, Image, Item, Label, Container, Segment, Loader, Dimmer } from 'semantic-ui-react'
import { productListURL, addToCartURL } from "../constants";
import { authAxios } from '../utils';
import { cartFetch } from '../store/actions/cart';
class Productlist extends React.Component {
    state = {
        loading: false,
        error: null,
        data: []
    }

    componentDidMount() {
        this.setState({ loading: true });
        axios.get(productListURL)
            .then(res => {
                console.log(res.data)
                this.setState({ data: res.data, loading: false });
            })
            .catch(err => {
                this.setState({ error: err, loading: false });
            })
    }

    handleAddToCart = slug => {
        if (this.props.authenticated) {
            this.setState({ loading: true });
            authAxios
                .post(addToCartURL, { slug })
                .then(res => {
                    this.props.refreshCart();
                    this.setState({ loading: false });
                })
                .catch(err => {
                    this.setState({ error: err, loading: false });
                    console.log(err);
                });
        }
        else {
            this.setState({ error: 'You are not login in this site' });
        }
    };

    render() {
        const { authenticated } = this.props;
        console.log(authenticated);
        const { data, error, loading } = this.state;
        return (
            <Container>
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
                <Item.Group divided>
                    {data.map(item => {
                        return <Item key={item.id}>
                            <Item.Image src={item.image} />
                            <Item.Content>
                                <Item.Header as='a'>{item.title}</Item.Header>
                                <Item.Meta>
                                    <span className='cinema'>{item.category}</span>
                                </Item.Meta>
                                <Item.Description>{item.description}</Item.Description>
                                <Item.Meta style={{ color: 'black' }} >
                                    {item.discount_price ?
                                        <>
                                            <h4>Price:Rs.{item.price}</h4>
                                            <h4><b>Discount Price:Rs.{item.discount_price}</b> <Label color="blue">Discount</Label></h4></>
                                        : <h4>Price:Rs.{item.price}</h4>
                                    }
                                </Item.Meta>
                                <Item.Extra>
                                    {/* {authenticated ? */}
                                    <Button primary floated='right' icon labelPosition="right"
                                        onClick={() => this.handleAddToCart(item.slug)}                      >
                                        Add-To-Cart
                                    <Icon name='cart plus' />
                                    </Button>
                                    {/* : this.props.history.push("/login")} */}
                                    {item.discount_price && <Label color={item.label === "primary" ? "blue" : item.label === "secondary" ? "green" : "olive"}  >{item.label}</Label>}
                                </Item.Extra>



                            </Item.Content>
                        </Item>
                    })}
                </Item.Group>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        authenticated: state.auth.token !== null,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        refreshCart: () => dispatch(cartFetch())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Productlist);