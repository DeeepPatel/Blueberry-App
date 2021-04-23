import * as FileSystem from 'expo-file-system';
import { insertItem, getItems } from '../components/database'
import KEYS from '../keys';

export const ADD_ITEM = 'ADD_ITEM';
export const SET_ITEMS = 'SET_ITEMS';

export const addItem = (title, image, location) => {
    return async dispatch => {
        //using google reverse geocoding to get address based off of longitude and latitude 
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${KEYS.googleMapsApiKey}`);

        const responseData = await response.json();
        //console.log(responseData); Checking if the json data is fetched correctly

        const address = responseData.results[0].formatted_address;
        
        //converts a long string into parts using / as the target. Array of string segments will be made and retrieve the last segment
        const fileName = image.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;
        
        try{        
            FileSystem.moveAsync({
                from: image,
                to: newPath
            });
            const databaseResult = await insertItem(title, newPath, address, location.latitude, location.longitude);
            console.log(databaseResult);
            dispatch({ type: ADD_ITEM, itemData: { id: databaseResult.insertId, title: title, image: newPath, address: address, coordinates: {
                latitude: location.latitude,
                longitude: location.longitude
            }} });
        } catch (error){
            console.log(error);
            throw error;
        }
    };
};

export const loadItems = () => {
    return async dispatch => {
        try{
            const databaseResult = await getItems();
            console.log(databaseResult);
            dispatch({type: SET_ITEMS, items: databaseResult.rows._array});
        } catch (error){
            throw error;
        }
    };
};

//delete entryu https://aboutreact.com/example-of-sqlite-database-in-react-native/#DeleteUserjs