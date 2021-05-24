import React, { setState } from 'react';
import { Button, Container, Form, Grid, GridColumn, Header, Message, Segment, Select } from 'semantic-ui-react';
import { authAxios } from "../utils";
import { countryListURL, AddressURL, AddressUpdatetURL } from "../constants";
import { Link } from 'react-router-dom';
class UpdateAddress extends React.Component {
    state = {
        countries: [],
        address: [],
        apartment_address: null,
        street_address: null,
        user: null,
        zip: null,
        country: null,
        id: null,
        ass: "hello",
        formData: {},
        success: false,
        error: null,
        visible: true,
    }
    componentDidMount() {
        this.handleFetchAddress();
        this.handleFetchCountries();
        // this.handleFetchUserID();
    }

    handleDismiss = () => {
        this.setState({ visible: false });
        setTimeout(() => {
            this.setState({ visible: true })
        }, 2000)
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

                this.setState({ address: res.data, loading: false });
                console.log(this.state.address[0]['id']);
                this.setState({ street_address: this.state.address[0]['street_address'] })
                this.setState({ apartment_address: this.state.address[0]['apartment_address'] })
                this.setState({ user: this.state.address[0]['user'] })
                this.setState({ zip: this.state.address[0]['zip'] })
                this.setState({ country: this.state.address[0]['country'] })
                this.setState({ id: this.state.address[0]['id'] })

            })
            .catch(err => {
                this.setState({ error: err });
            })
    }
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        //console.log(this.state.street_address)
        console.log(e.target);
    };
    handleSelectChange = (e, { name, value }) => {
        // const { formData } = this.state;
        // const updateFormdata = {
        //     ...formData,
        //     [name]: value
        // };
        this.setState({ country: e.target.value });
        console.log(this.state.country);
    }

    handleUpdateAddress = e => {
        e.preventDefault();
        // const { formData, userID } = this.state;
        // console.log(formData);
        // this.setState({ loading: true })
        authAxios.put(AddressUpdatetURL(this.state.id), {
            user: this.state.user,
            id: this.state.id,
            street_address: this.state.street_address,
            apartment_address: this.state.apartment_address,
            country: this.state.country,
            zip: this.state.zip
        })

            .then(res => {
                this.setState({ saving: false, success: true });
            })
            .catch(err => {
                this.setState({ error: err });
            })

    };

    render() {
        const { countries, address, street_address, country, success, error } = this.state;
        console.log(this.state.success);
        return (
            <>

                <Form style={{ width: '400px', marginLeft: '450px' }} onSubmit={this.handleUpdateAddress} success={success} error={error}>
                    <Header textAlign="center">Update-Address</Header>
                    {success && (
                        <Message onDismiss={this.handleDismiss} success header="Success!" content="Your address was updated" />
                    )}
                    <Form.Input
                        required
                        name="street_address"
                        placeholder="Street address"
                        onChange={this.handleChange}
                        value={this.state.street_address}

                    />
                    <Form.Input
                        required
                        name="apartment_address"
                        placeholder="Apartment address"
                        onChange={this.handleChange}
                        value={this.state.apartment_address}

                    />
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
                            value={this.state.country}

                        />
                    </Form.Field>
                    <Form.Input
                        required
                        name="zip"
                        placeholder="Zip code"
                        onChange={this.handleChange}
                        value={this.state.zip}

                    />

                    {/* {success && <Message positive>
                        <Message.Header>Your Address updated</Message.Header>
                    </Message>} */}

                    {error && (
                        <Message
                            error
                            header="There was an error"
                            content={JSON.stringify(error)}
                        />
                    )}

                    <Form.Button primary >
                        Update
                    </Form.Button>
                </Form>
                <Link to="/Checkout">
                    <Button primary style={{ marginLeft: '450px', marginTop: '10px' }}  >
                        Check-out
                </Button>
                </Link>
                <br></br>
                <Link to="/profile">
                    <Button primary style={{ marginLeft: '450px', marginTop: '10px' }}  >
                        Back
                </Button>
                </Link>
            </>
        )
    }
}
export default UpdateAddress;