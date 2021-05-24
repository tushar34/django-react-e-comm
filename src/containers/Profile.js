import React from "react";
import { Button, Container, Form, Grid, GridColumn, Header, Message, Segment, Select } from 'semantic-ui-react';
import { AddressURL, AddressCreateURL, userIDtURL, countryListURL } from "../constants";
import { authAxios } from "../utils";
import { Dimmer, Loader, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

class Profile extends React.Component {

    state = {
        error: null,
        saving: false,
        success: false,
        address: [],
        formData: {},
        countries: [],
        loading: false,
        userID: null,
        id: null,
        user: null,
        street_address: null,
        apartment_address: null,
        country: null,
        zip: null,
        created: "notcreated",
    };
    componentDidMount() {
        this.handleFetchAddress();
        this.handleFetchCountries();
        this.handleFetchUserID();
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

    handleFetchUserID = () => {
        authAxios
            .get(userIDtURL)
            .then(res => {
                this.setState({ userID: res.data.userID });
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
                console.log(this.state.address);
            })
            .catch(err => {
                this.setState({ error: err });
            })
    }
    handleSelectChange = (e, { name, value }) => {
        const { formData } = this.state;
        const updateFormdata = {
            ...formData,
            [name]: value
        };
        this.setState({
            formData: updateFormdata
        });

    }
    handleChange = e => {
        console.log(e.target);
        const { formData } = this.state;
        const updateFormdata = {
            ...formData,
            [e.target.name]: e.target.value
        }
        this.setState({
            formData: updateFormdata

        });
    }

    handleCreateAddress = e => {
        e.preventDefault();
        const { formData, userID } = this.state;
        console.log(this.state.apartment_address);
        // this.setState({ loading: true })
        authAxios.post(AddressCreateURL, {
            user: userID,
            street_address: this.state.formData.street_address,
            apartment_address: this.state.formData.apartment_address,
            country: this.state.formData.country,
            zip: this.state.formData.zip,
        })
            .then(res => {
                this.setState({ saving: false, success: true, created: 'created', });
                this.handleFetchAddress();
            })
            .catch(err => {
                this.setState({ error: err });
            })

    }

    handleCreatchange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        const { error, loading, address, created, countries, saving, success, formData, updateFormdata } = this.state;
        console.log(formData);
        console.log(created);
        return (
            // onSubmit={this.handleSubmit} 

            <Container >
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
                {this.state.address == '' ?

                    < Form style={{ width: '400px', marginLeft: '350px' }} onSubmit={this.handleCreateAddress} success={success} error={error}>
                        <Header textAlign="center">Address</Header>
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
                                onChange={this.handleSelectChange}
                                value={this.state.formData.country}
                            />
                        </Form.Field>
                        <Form.Input
                            required
                            name="zip"
                            placeholder="Zip code"
                            onChange={this.handleChange}
                            value={this.state.zip}
                        />
                        {success && (
                            <Message success header="Success!" content="Your address was saved" />
                        )}
                        {error && (
                            <Message
                                error
                                header="There was an error"
                                content={JSON.stringify(error)}
                            />
                        )}

                        <Form.Button primary disabled={saving} loading={saving} >
                            Add
                            </Form.Button>

                    </Form>
                    :


                    <>
                        {address.map(a => {
                            return (
                                // <div key={a.id}>{a.street_address}</div>

                                // {created !== 'notcreated' ? : ''}
                                <Form key={a.id} style={{ width: '400px', marginLeft: '350px' }} success={success} error={error}>
                                    <Header textAlign="center">Address</Header>
                                    <Form.Input
                                        required
                                        name="street_address"
                                        placeholder="Street address"
                                        onChange={this.handleChange}
                                        value={a.street_address}
                                    />
                                    <Form.Input
                                        required
                                        name="apartment_address"
                                        placeholder="Apartment address"
                                        onChange={this.handleChange}
                                        value={a.apartment_address}
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
                                            onChange={this.handleSelectChange}
                                            value={a.country}
                                        />
                                    </Form.Field>
                                    <Form.Input
                                        required
                                        name="zip"
                                        placeholder="Zip code"
                                        onChange={this.handleChange}
                                        value={a.zip}
                                    />
                                    {success && (
                                        <Message success header="Success!" content="Your address was saved" />
                                    )}
                                    {error && (
                                        <Message
                                            error
                                            header="There was an error"
                                            content={JSON.stringify(error)}
                                        />
                                    )}
                                    {address == '' ?
                                        <Form.Button primary disabled={saving} loading={saving} >
                                            Add
                            </Form.Button>
                                        : ''}
                                </Form>
                            )


                        })
                        }
                    </>
                }
                {address != '' ?
                    <Link to="/Update-Address" ><Button primary style={{ marginLeft: '350px', marginTop: '10px' }} >Update Address</Button></Link>
                    : ''}
            </Container >
        )
    }
}
export default Profile;