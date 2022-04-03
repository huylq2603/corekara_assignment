import React, { Component } from "react";
import Geocode from "react-geocode";
import axios from "axios";

import PostCodeInput from "../../components/PostCodeInput";
import ForecastItem from "../../components/ForecastItem";
import Map from "../../components/Map";
import AirQuality from "../../components/AirQuality";
import styles from "./PostCodeInfo.module.css";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY);
Geocode.enableDebug();

class PostCodeInfo extends Component {

    state = {
        postCode: "",
        location: {
            prefecture: "",
            city: "",
            area: "",
            isEng: false,
        },
        geocode: {
            lat: null,
            lng: null,
        },
        forecastList: [],
        airQuality: {}
    }

    getInfoByPostCode = async (postCode) => {
        try {
            await this.getLocationByPostCode(postCode);
            await this.getLatLngByLocation();
            this.getForecastByLatLng();
            this.getAirQualityByLatLng();
        } catch (errMess) {
            alert(errMess);
            return;
        }
    }

    getLocationByPostCode = async (postCode) => {
        const promise = new Promise(async (resolve, reject) => {
            let postalCodeEndpoint = `${process.env.REACT_APP_POSTAL_CODE_API}/${postCode.substring(0, 3)}/${postCode.substring(postCode.length - 4)}.json`;
            try {
                let res = await axios.get(postalCodeEndpoint);
                if (res && res.data && res.data.data && res.data.data.length > 0) {
                    let isEng = res.data.data[0].en.prefecture ? true : false;
                    let location = isEng ? res.data.data[0].en : res.data.data[0].ja;
                    this.setState({
                        postCode,
                        location: {
                            prefecture: location.prefecture,
                            city: location.address2,
                            area: location.address1,
                            isEng
                        }
                    }, () => {
                        resolve();
                    })
                }
            } catch (err) {
                reject("Sorry! Postal code not found. Please type in another Japan postal code (ex. 160-0022)");
            }
        });
        return promise;
    }

    getLatLngByLocation = async () => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                let res = await Geocode.fromAddress(this.state.location.prefecture + " " + this.state.location.city + " " + this.state.location.area)
                const { lat, lng } = res.results[0].geometry.location;
                this.setState({
                    geocode: {
                        lat,
                        lng
                    }
                }, () => {
                    resolve();
                })

            } catch (err) {
                reject(`Cannot find latitude and longitude of ${this.state.location.prefecture}!`);
            }
        });
        return promise;
    }

    getForecastByLatLng = async () => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                let weatherEndpoint = `${process.env.REACT_APP_WEATHER_API}?lat=${this.state.geocode.lat}&lon=${this.state.geocode.lng}&exclude=current,minutely,hourly,alerts&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;
                let res = await axios.get(weatherEndpoint);
                let forecastList = res.data.daily.slice(0, 3);
                this.setState({
                    forecastList: [...forecastList]
                }, () => {
                    resolve();
                })
            } catch (err) {
                reject(`Cannot find forecast!`);
            }
        });
        return promise;
    }

    getAirQualityByLatLng = async () => {
        const promise = new Promise(async (resolve, reject) => {
            try {
                let airEndpoint = `${process.env.REACT_APP_AIR_API}?lat=${this.state.geocode.lat}&lon=${this.state.geocode.lng}&appid=${process.env.REACT_APP_WEATHER_KEY}`;
                let res = await axios.get(airEndpoint);
                let airQuality = res.data.list[0];
                this.setState({
                    airQuality
                }, () => {
                    console.log(this.state);
                    resolve();
                })
            } catch (err) {
                reject(`Cannot find air quality information!`);
            }
        });
        return promise;
    }

    render() {
        const location = () => {
            let prefecture = this.state.location.prefecture + ", ";
            let city = this.state.location.city && this.state.location.isEng ? this.state.location.city + " City, " : "";
            let area = this.state.location.area;
            return `${prefecture}${city}${area}`
        }

        const forecast = this.state.forecastList.map((el, index) => {
            return <ForecastItem key={index} forecastInfo={el} />
        });

        return (
            <div className={styles.postCodeInfo}>
                <PostCodeInput getInfoByPostCode={this.getInfoByPostCode} />

                {this.state.postCode &&
                    <>
                        <h1>{location()}</h1>
                        <div className={styles.forecastContainer}>
                            <h3>3-day forecast</h3>
                            <div className={styles.forecastGroup}>
                                {forecast}
                            </div>
                        </div>
                        <div className={styles.bottomContainer}>
                            <div className={styles.bottomGroup}>
                                <h3>Map</h3>
                                <Map geocode={this.state.geocode} />
                            </div>
                            <div className={styles.bottomGroup}>
                                <AirQuality
                                    aqi={this.state.airQuality}
                                    canvasWidth={275}
                                    canvasHeight={350}
                                />
                            </div>
                        </div>
                    </>
                }
            </div>
        )
    }
}

export default PostCodeInfo;