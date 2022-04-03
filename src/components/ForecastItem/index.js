import React, { Component } from "react";
import styles from "./ForecastItem.module.css"

class ForecastItem extends Component {

    state = {
        forecastInfo: this.props.forecastInfo,
        date: "",
        dayOfWeek: "",
        weather: "",
        iconLink: "",
        minTemp: "",
        maxTemp: "",
    }

    DAY_OF_WEEK = ["Sun", "Mon", "TUE", "WED", "THU", "FRI", "SAT"];

    componentDidMount = () => {
        this.generateDataFromForecastInfo();
    }

    //receive new props when submit a new post code
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.forecastInfo && nextProps.forecastInfo !== this.state.forecastInfo) {
            this.setState({ forecastInfo: nextProps.forecastInfo }, () => { this.generateDataFromForecastInfo(); });
        }
    }

    //create readable data from received props
    generateDataFromForecastInfo = () => {
        const targetDate = new Date(this.state.forecastInfo.dt * 1000);
        let year = targetDate.getFullYear();
        let month = targetDate.getMonth() + 1 >= 10 ? targetDate.getMonth() + 1 : '0' + (targetDate.getMonth() + 1);
        let day = targetDate.getDate() >= 10 ? targetDate.getDate() + 1 : '0' + targetDate.getDate();
        let date = `${year}-${month}-${day}`;

        let dayOfWeek = this.DAY_OF_WEEK[targetDate.getDay()];

        let weather = this.state.forecastInfo.weather[0].main;
        let iconLink = `${process.env.REACT_APP_WEATHER_ICON}/${this.state.forecastInfo.weather[0].icon}@2x.png`;

        let minTemp = `${this.state.forecastInfo.temp.min}°`;
        let maxTemp = `${this.state.forecastInfo.temp.max}°`;

        this.setState({
            date,
            dayOfWeek,
            weather,
            iconLink,
            minTemp,
            maxTemp
        });
    }

    render() {
        return (
            <div className={styles.forecastItem}>
                <div className={styles.weatherIcon}>
                    <img src={this.state.iconLink} alt="weatherIcon" />
                </div>
                <div className={styles.date}>
                    <span>{this.state.date}</span>
                    <span>{this.state.dayOfWeek}</span>
                </div>
                <div className={styles.weather}>
                    <span>{this.state.weather}</span>
                </div>
                <div className={styles.temp}>
                    <span>Max: {this.state.maxTemp}</span>
                    <span>Min: {this.state.minTemp}</span>
                </div>
            </div>
        )
    }

}

export default ForecastItem;