import profilePicturePlaceholderPath from "../assets/img/profile-picture-placeholder.png";

export const createPlaceholderFile = async (name) => {
    let response = await fetch(profilePicturePlaceholderPath);
    let data = await response.blob();
    let metadata = {
        type: 'image/png'
    };
    return new File([data], name, metadata);
}