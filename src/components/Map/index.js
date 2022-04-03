import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Marker } from "react-google-maps";

class Map extends Component {

    state = {
        zoom: 12,
        height: 400,
        mapPosition: {
            lat: this.props.geocode.lat,
            lng: this.props.geocode.lng,
        },
        markerPosition: {
            lat: this.props.geocode.lat,
            lng: this.props.geocode.lng,
        }
    }
    
    //receive new props when submit a new post code
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.geocode && nextProps.geocode !== this.state.mapPosition) {
            this.setState({
                mapPosition: nextProps.geocode,
                markerPosition: nextProps.geocode
            });
        }
    }

    render() {
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                    <GoogleMap
                        defaultZoom={this.state.zoom}
                        defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
                    >
                        <Marker position={this.state.markerPosition} />
                    </GoogleMap>
                )
            )
        );

        return (
            <div>
                {this.state.mapPosition.lat && this.state.mapPosition.lng &&
                    <AsyncMap
                        googleMapURL={`${process.env.REACT_APP_GOOGLE_MAP_API}?key=${process.env.REACT_APP_GOOGLE_KEY}&region=US&language=en`}
                        loadingElement={
                            <div style={{ height: `100%` }} />
                        }
                        containerElement={
                            <div style={{ height: this.state.height }} />
                        }
                        mapElement={
                            <div style={{ height: `100%` }} />
                        }
                    />
                }
            </div>
        )
    }
}

export default Map