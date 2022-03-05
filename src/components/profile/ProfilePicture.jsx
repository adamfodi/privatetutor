import {Image} from "primereact/image";
import {Button} from "primereact/button";
import Swal from "sweetalert2";
import {useEffect, useRef, useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytes, getMetadata} from "firebase/storage";
import {connect} from "react-redux";
import {ProgressSpinner} from "primereact/progressspinner";
import profilePicturePlaceholder from "../../assets/img/profile-picture-placeholder.png"
import {createPlaceholderFile} from "../../util/FileUtil";
import "../../assets/css/profile/profile-picture.css"

const ProfilePicture = (props) => {
    const {firebaseAuth} = props;
    const [file, setFile] = useState(null);
    const [placeholder, setPlaceholder] = useState("true");
    const [tempUrl, setTempUrl] = useState(null);
    const [currUrl, setCurrUrl] = useState(null);

    const fileRef = useRef();
    const storage = getStorage();
    const storageRef = ref(storage, 'profilePictures/' + firebaseAuth.uid);

    const getPlaceholder = () => {
        console.log("asd")
        getMetadata(storageRef)
            .then((metadata) => {
                if (metadata.customMetadata) {
                    setPlaceholder(metadata.customMetadata.placeholder)
                } else {
                    setPlaceholder("false")
                }
            })
            .catch(() => {
                setPlaceholder("false")
            });
    }

    const getProfilePicture = () => {
        getDownloadURL(storageRef)
            .then((url) => {
                setTempUrl(url);
                setCurrUrl(url);
            })
            .catch(() => {
                setTempUrl(profilePicturePlaceholder);
                setCurrUrl(profilePicturePlaceholder);
            })
    }

    useEffect(() => {
        getProfilePicture();
        getPlaceholder();
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
                console.log(file)
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
                getPlaceholder();
                setCurrUrl(tempUrl);
                setFile(null);
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

    const resetToDefault = () => {
        Swal.fire({
            title: "Biztosan törölni szeretnéd a profilképed?",
            showDenyButton: true,
            confirmButtonText: 'Igen',
            denyButtonText: `Nem`,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                createPlaceholderFile(firebaseAuth.uid).then((file) => {
                    const metadata = {
                        customMetadata: {
                            'placeholder': 'true'
                        }
                    };
                    uploadBytes(storageRef, file, metadata)
                        .then(() => {
                            getProfilePicture();
                            getPlaceholder();
                            setFile(null);
                            Swal.fire({
                                timer: 1500,
                                icon: "success",
                                title: "Sikeres törlés!",
                                showConfirmButton: false,
                                allowOutsideClick: false,
                            })
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: "error",
                                title: "Hiba történt a törlés során!",
                                allowOutsideClick: false,
                            });
                        })
                })
            }
        })
    }

    return (
        <div className="profile-picture-container">
            <div className="profile-picture-image-container">
                <span>
                    <Button type="button"
                            icon="pi pi-replay"
                            className="p-button-rounded"
                            tooltip="Profilkép visszaállítása"
                            onClick={() => {
                                setTempUrl(currUrl);
                                setFile(null)
                            }}
                            disabled={!tempUrl}
                    />
                    <Button type="button"
                            icon="pi pi-times"
                            className="p-button-rounded"
                            tooltip="Profilkép törlése"
                            onClick={() => resetToDefault()}
                            disabled={!tempUrl || placeholder === "true"}
                    />
                </span>
                {!tempUrl
                    ? <ProgressSpinner style={{width: "35vh", height: "33.5vh"}}/>
                    : <Image src={tempUrl}
                             alt="Profile Picture"
                             preview
                             downloadable
                    />
                }
            </div>
            <div className="profile-picture-button-container">
                <Button type="button"
                        label="Kiválasztás..."
                        className="p-button-primary"
                        onClick={() => uploadButtonClick(fileRef)}
                        disabled={!tempUrl}
                />
                <input type="file"
                       accept="image/*"
                       id="file"
                       ref={fileRef}
                       style={{display: "none"}}
                       onChange={event => uploadChangeFile(event, fileRef)}
                />
                <Button type="button"
                        label="Feltöltés"
                        className="p-button-success"
                        onClick={() => uploadPicture()}
                        disabled={!tempUrl || !file}
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