
export const LocationName = async ({latitude, longitude}) =>{
    try {
        const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + 'AIzaSyBTOio8IArwobWjnwXjukT9PtTNlS3981g');
        const responseJson = await response.json();

        const cityComponent = responseJson.results[0].address_components.find(component => component.types.includes('locality'));
        const stateComponent = responseJson.results[0].address_components.find(component => component.types.includes('administrative_area_level_1'));

        const city = cityComponent ? cityComponent.long_name : '';
        const state = stateComponent ? stateComponent.short_name : '';

        if(city && state){
            return city + ', ' + state
        }
    } catch (error) {
        console.warn(error);
        return null; // or handle the error accordingly
    }
}