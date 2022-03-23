import {Image} from "primereact/image";
import {Button} from "primereact/button";
import Swal from "sweetalert2";
import {useRef, useState} from "react";
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {connect} from "react-redux";
import placeholder from "../../assets/img/profile-picture-placeholder.png"
import "../../assets/css/profile/profile-picture.css"
import {UserService} from "../../services/UserService";

const ProfilePicture = (props) => {
    const {auth, profilePictureUrl} = props;
    const [newUrl, setNewUrl] = useState(profilePictureUrl);
    const [file, setFile] = useState(null);
    const fileRef = useRef();
    const storage = getStorage();
    const storageRef = ref(storage, 'profilePictures/' + auth.uid);

    console.log(newUrl)

    const uploadButtonClick = (fileRef) => {
        fileRef.current.click();
    };

    const uploadChangeFile = (event, fileRef) => {
        if (event.target.value.length !== 0) {
            const file = event.target.files[0];
            fileRef.current.value = null;

            if (file.size <= 5000000) {
                setNewUrl(URL.createObjectURL(file))
                setFile(file)
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
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            title: "Feltöltés...",
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        uploadBytes(storageRef, file)
            .then(() => {
                getDownloadURL(storageRef)
                    .then((url) => {
                        UserService.updateProfilePictureUrl(auth.uid, url)
                            .then(() => {
                                setNewUrl(url);
                                setFile(null);

                                Swal.fire({
                                    timer: 1500,
                                    icon: "success",
                                    title: "Sikeres módosítás!",
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                })
                            })
                    })
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Hiba történt a feltöltés során!",
                    allowOutsideClick: false,
                });
            })
    };

    const resetToDefault = () => {
        Swal.fire({
            title: "Biztosan törölni szeretnéd a profilképed?",
            showDenyButton: true,
            confirmButtonText: 'Igen',
            denyButtonText: `Nem`,
            allowOutsideClick: false
        })
            .then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        title: "Törlés...",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    deleteObject(storageRef)
                        .then(() => {
                            UserService.updateProfilePictureUrl(auth.uid, null)
                                .then(() => {
                                    setNewUrl(null);
                                    setFile(null);

                                    Swal.fire({
                                        timer: 1500,
                                        icon: "success",
                                        title: "Sikeres törlés!",
                                        showConfirmButton: false,
                                        allowOutsideClick: false,
                                    })
                                })
                        })
                        .catch(() => {
                            Swal.fire({
                                icon: "error",
                                title: "Hiba történt a törlés során!",
                                allowOutsideClick: false,
                            });
                        })
                }
            })
    };

    return (
        <div className="profile-picture-container">
            <div className="profile-picture-image-container">
                <span>
                    <Button type="button"
                            icon="pi pi-replay"
                            className="p-button-rounded"
                            tooltip="Profilkép visszaállítása"
                            onClick={() => {
                                setNewUrl(profilePictureUrl);
                                setFile(null)
                            }}
                    />
                    <Button type="button"
                            icon="pi pi-times"
                            className="p-button-rounded"
                            tooltip="Profilkép törlése"
                            onClick={() => resetToDefault()}
                            disabled={!profilePictureUrl}
                    />
                </span>
                <Image src={newUrl ? newUrl : placeholder}
                       alt="Profile Picture"
                       preview
                       downloadable
                />
            </div>
            <div className="profile-picture-button-container">
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
                       onChange={event => uploadChangeFile(event, fileRef)}
                />
                <Button type="button"
                        label="Feltöltés"
                        className="p-button-success"
                        onClick={() => uploadPicture()}
                        disabled={!file}
                />
            </div>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
    };
};

export default connect(mapStateToProps)(ProfilePicture);