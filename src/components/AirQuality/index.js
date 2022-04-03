import React, { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import styles from "./AirQuality.module.css"

class AirQuality extends Component {
    
    state = {
        speed: 20,
        image: null,
        width: 50,
        height: 50,
        x: Math.random() * this.props.canvasWidth,
        y: Math.random() * this.props.canvasHeight,
        xSpeed: 2,
        ySpeed: 2,
        aqi: this.props.aqi,
        aqiText: "",
    };

    AQI = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    AQI_COMPONENTS = ['co', 'no', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3'];
    AQI_IMAGE = ['good.png', 'moderate.png', 'unhealthyForSensitive.png', 'unhealthy.png', 'hazardous.png'];
    moveImgTimeout = null;

    //init image
    componentDidMount = () => {
        const image = new window.Image();
        image.src = require('../../resources/good.png');
        image.width = 50;
        image.height = 50;
        image.onload = () => {
            this.setState({
                image: image,
                width: 50,
                height: 50
            }, () => {
                this.moveImg();
            });
        }
    }

    //receive new props when submit a new post code
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.aqi && nextProps.aqi !== this.state.aqi) {
            this.setState({ aqi: nextProps.aqi }, () => {
                this.changeAqiText();
                this.changeImage();
            });
        }
    }

    moveImg = () => {
        this.moveImgTimeout = setTimeout(() => {
            let xSpeed = this.state.xSpeed;
            let ySpeed = this.state.ySpeed;
            let x = this.state.x + xSpeed;
            let y = this.state.y + ySpeed;

            //changeAqiText every time icon hits border
            if (x + this.state.width >= this.props.canvasWidth) {
                xSpeed = -xSpeed;
                x = this.props.canvasWidth - this.state.width;
                this.changeAqiText();
            } else if (x <= 0) {
                xSpeed = -xSpeed;
                x = 0;
                this.changeAqiText();
            }

            if (y + this.state.height >= this.props.canvasHeight) {
                ySpeed = -ySpeed;
                y = this.props.canvasHeight - this.state.height;
                this.changeAqiText();
            } else if (y <= 0) {
                ySpeed = -ySpeed;
                y = 0;
                this.changeAqiText();
            }

            this.setState({
                x,
                y,
                xSpeed,
                ySpeed
            }, () => {
                this.moveImg();
            })
        }, this.state.speed)
    }

    //create a new AQI (Air Quality Index) icon based on AQI
    changeImage = () => {
        clearTimeout(this.moveImgTimeout);
        const image = new window.Image();
        image.src = require(`../../resources/${this.AQI_IMAGE[this.state.aqi.main.aqi - 1]}`);
        image.width = 50;
        image.height = 50;
        image.onload = () => {
            this.setState({
                image: image,
                width: 50,
                height: 50
            }, () => {
                this.moveImg();
            });
        }
    }

    changeAqiText = () => {
        let component = Math.floor(Math.random() * 8);
        let componentName = this.AQI_COMPONENTS[component];
        let aqiText = `Сoncentration of ${componentName}: ${this.state.aqi && this.state.aqi.components && this.state.aqi.components[componentName]} μg/m3`;
        this.setState({ aqiText });
    }

    render() {
        return (
            <div className={styles.airQuality}>
                <h3>Air Quality: {this.state.aqi && this.state.aqi.main && this.state.aqi.main.aqi} - {this.AQI[this.state.aqi && this.state.aqi.main && this.state.aqi.main.aqi - 1]}</h3>
                <h5>{this.state.aqiText}</h5>
                <Stage
                    width={this.props.canvasWidth}
                    height={this.props.canvasHeight}
                >
                    <Layer>
                        <Image
                            x={this.state.x}
                            y={this.state.y}
                            width={this.state.width}
                            height={this.state.height}
                            image={this.state.image}
                        />
                    </Layer>
                </Stage>
            </div>
        );
    }

}

export default AirQuality;