import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapPreview from './MapPreview';


import Colours from '../Colours';

const LocationPicker = props => {
    const [isFetching, setIsFetching] = useState(false);
    const [pickedLocation, setPickedLocation] = useState();


    //Adding permissions to allow location working on iOS as well.
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted'){
            Alert.alert('You need to grant location permissions to use this app.', [{Text: 'Okay'}]);
            return false;
        }
        return true;
    };

    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission){
            return;
        }

        try{
            setIsFetching(true);
            const location = await Location.getCurrentPositionAsync({timeout: 5000});
            console.log(location);
            setPickedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        } catch(error){
            Alert.alert('Could not get location', 'Please try again late or pick a location on the map.', [{text: 'Okay'}]);
        }
        setIsFetching(false);
        
    };

    return <View style = {styles.locationPicker}>
        <MapPreview style = {styles.mapPreview} location = {pickedLocation}>
            {isFetching ? (<ActivityIndicator size = "large" color = {Colours.primary} />) : (<Text>No Location has been chosen yet!</Text>)}
        </MapPreview>        
        <Button title = "Get User Location" color = {Colours.primary} onPress = {getLocationHandler}/>
    </View>
};


const styles = StyleSheet.create({
    locationPicker: {
        marginBottom: 15,
    },
    mapPreview: {
        marginBottom: 10,
        width: '100%',
        height: 150,
        borderColor: '#ccc',
        borderWidth: 1
        }
});

export default LocationPicker;