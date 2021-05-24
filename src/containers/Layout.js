import React, { useEffect } from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { cartFetch } from "../store/actions/cart";
class CustomLayout extends React.Component {

  componentDidMount() {
    this.props.cartFetch();
  }
  render() {
    const { authenticated, cart, loading } = this.props;
    console.log(cart);
    return (
      <div>
        <Menu inverted>
          <Container>
            <Link to="/">
              <Menu.Item header>Home</Menu.Item>
            </Link>
            <Link to="/products">
              <Menu.Item header>products</Menu.Item>
            </Link>
            <Menu.Menu position='right'>
              {authenticated ? (
                <React.Fragment>
                  <Link to="/profile"><Menu.Item header >
                    Profile
              </Menu.Item></Link>
                  <Dropdown icon='cart' loading={loading} text={`${cart !== null ? cart.order_items.length : 0} `} pointing className='link item'>
                    <Dropdown.Menu>
                      {cart && cart.order_items.map(oreder_item => {
                        return (<Dropdown.Item key={oreder_item.id} >
                          {oreder_item.quantity} x {oreder_item.item}</Dropdown.Item>
                        );
                      })}
                      {cart && cart.order_items.length < 1 ? (<Dropdown.Item> Your cart is empty </Dropdown.Item>) : null}
                      <Dropdown.Divider />
                      <Dropdown.Item icon='arrow right' text='Cheakout' onClick={() => this.props.history.push('/order-summary')} />
                    </Dropdown.Menu>
                  </Dropdown>

                  <Menu.Item header onClick={() => this.props.logout()}>
                    Logout
              </Menu.Item>
                </React.Fragment>
              )
                :
                (
                  <React.Fragment>
                    <Link to="/login">
                      <Menu.Item header>Login</Menu.Item>
                    </Link>
                    <Link to="/signup">
                      <Menu.Item header>Signup</Menu.Item>
                    </Link>
                  </React.Fragment>
                )}
            </Menu.Menu>

          </Container>
        </Menu>

        { this.props.children}

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 1" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 2" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Group 3" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header inverted as="h4" content="Footer Header" />
                <p>
                  Extra space for a call to action inside the footer that could
                  help re-engage users.
                </p>
              </Grid.Column>
            </Grid>

            <Divider inverted section />
            <Image centered size="mini" src="/logo.png" />
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>

          </Container>
        </Segment>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    cartFetch: () => dispatch(cartFetch())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
