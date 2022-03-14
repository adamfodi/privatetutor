import {connect} from "react-redux";
import "../../assets/css/tutor/advertisement.css"
import React, {useEffect, useState} from "react";
import {editorHeader, educationLevelList, subjectsList} from "../../util/FormFields";
import {Dropdown} from "primereact/dropdown";
import {MultiSelect} from "primereact/multiselect";
import {Editor} from "primereact/editor";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
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
                            <p>Legmagasabb iskolai végzettség</p>
                            <div>
                                <Dropdown value={newAdvertisement.educationLevel}
                                          options={educationLevelList}
                                          onChange={(e) => setNewAdvertisement({
                                                  ...newAdvertisement, educationLevel: e.target.value
                                              }
                                          )}
                                          optionLabel="name"
                                          placeholder="Válassz végzettséget"
                                />
                            </div>
                        </div>
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
                        <div className="tutor-advertisement-field">
                            <Button type="button"
                                    label="Órarend beállítása"
                                    className="tutor-advertisement-timetable-button p-button-raised p-button-secondary"
                                    onClick={() => setDisplayTimetable(true)}
                            />
                            <Dialog showHeader={false}
                                    visible={displayTimetable}
                                    position={"bottom"}
                                    modal
                                    onHide={() => setDisplayTimetable(false)}
                                    draggable={false}
                                    resizable={false}
                                    className="timetable-dialog"
                            >
                                <Timetable timetable={newAdvertisement.timetable}
                                           setNewAdvertisement={setNewAdvertisement}
                                           setDisplayTimetable={setDisplayTimetable}
                                />
                            </Dialog>

                        </div>
                        <span>
                                <p>Szeretném, hogy a hirdetések között megjelenjek</p>
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
        advertisement: state.firebase.auth.isLoaded && state.firestore.data.users
            ? state.firestore.data.users[state.firebase.auth.uid]['tutor']['advertisement']
            : null
    };
};

export default connect(mapStateToProps)(Advertisement);