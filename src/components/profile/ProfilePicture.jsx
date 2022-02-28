import {Image} from "primereact/image";
import {Button} from "primereact/button";
import Swal from "sweetalert2";
import {useEffect, useRef, useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {connect} from "react-redux";
import {ProgressSpinner} from "primereact/progressspinner";

const ProfilePicture = (props) => {
    const {firebaseAuth} = props;
    const [file, setFile] = useState(null);
    const [tempUrl, setTempUrl] = useState(null);
    const [currUrl, setCurrUrl] = useState(null);

    const fileRef = useRef();
    const storage = getStorage();
    const storageRef = ref(storage, 'profilePictures/' + firebaseAuth.uid);

    const getProfilePicture = () => {
        getDownloadURL(storageRef)
            .then((url) => {
                setTempUrl(url);
                setCurrUrl(url);
            })
    }

    useEffect(() => {
        getProfilePicture();
    }, []);

    const uploadButtonClick = (fileRef) => {
        fileRef.current.click();
    };

    const uploadChangeFile = (event, fileRef) => {
        if (event.target.value.length !== 0) {
            event.stopPropagation();
            event.preventDefault();
            const file = event.target.files[0];
            fileRef.current.value = null;

            if (file.size <= 5000000) {
                setTempUrl(URL.createObjectURL(file))
                setFile(file);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "A kép mérete maximum 5 MB lehet!",
                    allowOutsideClick: false,
                });
            }
        }
    };

    const uploadPicture = () => {
        uploadBytes(storageRef, file)
            .then(() => {
                setCurrUrl(tempUrl);
                Swal.fire({
                    timer: 1500,
                    icon: "success",
                    title: "Sikeres módosítás!",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                })
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Hiba történt a feltöltés során!",
                    allowOutsideClick: false,
                });
            })
    }

    return (
        <div className="profile-picture-content">
            <div className="profile-picture-content-picture">
                <span>
                    <Button type="button"
                            icon="pi pi-times"
                            className="p-button-rounded"
                            onClick={() => setTempUrl(currUrl)}
                    />
                    </span>
                {!tempUrl
                    ? <ProgressSpinner style={{width: "300px", height: "300px"}}/>
                    : <Image src={tempUrl}
                             alt="Profile Picture"
                             width="300"
                             height="300"
                             preview
                             downloadable
                    />
                }
            </div>
            <div className="profile-picture-content-upload">
                <Button type="button"
                        label="Kiválasztás..."
                        className="p-button-primary"
                        onClick={() => uploadButtonClick(fileRef)}
                />
                <input type="file"
                       accept="image/*"
                       id="file"
                       ref={fileRef}
                       style={{display: "none"}}
                       onChange={event => uploadChangeFile(event, fileRef)
                       }
                />
                <Button type="button"
                        label="Feltöltés"
                        className="p-button-success"
                        onClick={() => uploadPicture()}
                />

            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
    };
};

export default connect(mapStateToProps)(ProfilePicture);