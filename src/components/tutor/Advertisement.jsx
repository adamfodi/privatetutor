import {connect} from "react-redux";
import "../../assets/css/tutor/advertisement.css"
import React, {useEffect, useState} from "react";
import {editorHeader, subjectsList} from "../../util/FormFields";
import {MultiSelect} from "primereact/multiselect";
import {Editor} from "primereact/editor";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import Timetable from "./Timetable";
import {Checkbox} from "primereact/checkbox";
import {UserService} from "../../services/UserService";
import Swal from "sweetalert2";

const Advertisement = (props) => {
    const {advertisement, firebaseAuth} = props;
    const [newAdvertisement, setNewAdvertisement] = useState(null);
    const [displayTimetable, setDisplayTimetable] = useState(false);


    useEffect(() => {
        console.log("csak akkor fut le, ha megvaltozott az adat firestoreban")
        if (advertisement) {
            setNewAdvertisement({...advertisement})
        }
    }, [advertisement]);

    const subjectsFooterTemplate = () => {
        const length = newAdvertisement.subjects ? newAdvertisement.subjects.length : 0;
        return (
            <div className="py-2 px-3">
                <b>{length} db tárgy kiválasztva.</b>
            </div>
        );
    };

    const onSubmit = () => {
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false

        });
        UserService.updateTutorAdvertisement(firebaseAuth.uid, newAdvertisement)
            .then(() => {
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
                    title: "Hiba történt a hirdetés módosítása során!",
                    allowOutsideClick: false,
                });
            })
    };

    console.log(newAdvertisement)

    return (
        <div className="component-container">
            <p className="component-header">Hirdetés</p>
            {newAdvertisement
                ? <div className="component-content">
                    <div className="tutor-advertisement-container">
                        <p>Töltsd ki a következő mezőekt bla bla ba asddddddddddddddddddddddddddddddl</p>
                        <div className="tutor-advertisement-field">
                            <p>Oktatni kívánt tárgyak</p>
                            <div>
                                <MultiSelect value={newAdvertisement.subjects}
                                             options={subjectsList}
                                             onChange={(e) => setNewAdvertisement({
                                                     ...newAdvertisement, subjects: e.target.value
                                                 }
                                             )}
                                             optionLabel="name"
                                             placeholder="Válassz tantárgyat"
                                             filter
                                             display={"chip"}
                                             panelFooterTemplate={subjectsFooterTemplate}
                                />
                            </div>

                        </div>
                        <div className="tutor-advertisement-field">
                            <p>Óradíj</p>
                            <div>
                                <InputNumber value={newAdvertisement.hourlyRate}
                                             onValueChange={(e) => setNewAdvertisement({
                                                     ...newAdvertisement, hourlyRate: e.target.value
                                                 }
                                             )}
                                             mode="currency"
                                             currency="HUF"
                                             locale="hu-HU"
                                             useGrouping={false}
                                             maxFractionDigits={0}
                                             min={0}
                                />
                            </div>

                        </div>
                        <div className="tutor-advertisement-field">
                            <p>Bemutatkozás</p>
                            <div>
                                <Editor
                                    headerTemplate={editorHeader}
                                    value={newAdvertisement.introduction}
                                    onTextChange={(e) => setNewAdvertisement({
                                            ...newAdvertisement, introduction: e.htmlValue
                                        }
                                    )}
                                    style={{height: "30vh"}}
                                />
                            </div>

                        </div>
                        <div className="tutor-advertisement-timetable">
                            <p>Órarend</p>
                            <Timetable timetable={newAdvertisement.timetable}
                                       setNewAdvertisement={setNewAdvertisement}
                                       readonly={false}
                            />
                        </div>
                        <span>
                                <p>Szeretnék az oldal hirdetései között megjelenni!</p>
                                <Checkbox checked={newAdvertisement.active}
                                          onChange={(e) => setNewAdvertisement({
                                                  ...newAdvertisement, active: e.checked
                                              }
                                          )}
                                          disabled={false}
                                >
                                </Checkbox>
                        </span>
                    </div>
                    <div className="tutor-advertisement-button-div">
                        <Button label="Mentés"
                                className="p-button-success"
                                onClick={() => onSubmit()}
                        />
                    </div>
                </div>
                : <p>Loading...</p>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firebaseAuth: state.firebase.auth,
        advertisement: !state.firebase.auth.isEmpty && !state.firebase.profile.isEmpty
            ? state.firebase.profile.tutor.advertisement
            : null
    };
};

export default connect(mapStateToProps)(Advertisement);