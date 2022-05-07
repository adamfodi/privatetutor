import {connect} from "react-redux";
import "../../assets/css/tutor/ad.css"
import React, {useEffect, useState} from "react";
import {editorHeader, subjectsList} from "../../util/FormFields";
import {MultiSelect} from "primereact/multiselect";
import {Editor} from "primereact/editor";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import Timetable from "../Timetable";
import {Checkbox} from "primereact/checkbox";
import {UserService} from "../../services/UserService";
import Swal from "sweetalert2";
import {ProgressSpinner} from "primereact/progressspinner";

const Ad = (props) => {
    const {advertisement, firebaseAuth} = props;
    const [newAd, setNewAd] = useState(null);

    useEffect(() => {
        if (advertisement) {
            setNewAd({...advertisement})
        }
    }, [advertisement]);

    const subjectsFooterTemplate = () => {
        const length = newAd.subjects ? newAd.subjects.length : 0;
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
        UserService.updateTutorAdvertisement(firebaseAuth.uid, newAd)
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

    return (
        <div className="ad-container">
            <p className="header">Hirdetés</p>
            {newAd
                ? <div>
                    <div className="subjects-div">
                        <p>Oktatott tárgyak</p>
                        <div>
                            <MultiSelect value={newAd.subjects}
                                         options={subjectsList}
                                         onChange={(e) => setNewAd({
                                                 ...newAd, subjects: e.target.value
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
                    <div className="hourly-rate-div">
                        <p>Óradíj</p>
                        <div>
                            <InputNumber value={newAd.hourlyRate}
                                         onValueChange={(e) => setNewAd({
                                                 ...newAd, hourlyRate: e.target.value
                                             }
                                         )}
                                         mode="currency"
                                         currency="HUF"
                                         locale="hu-HU"
                                         useGrouping={false}
                                         maxFractionDigits={0}
                                         min={0}
                                         max={99999}
                                         tooltip="max. 99999"
                            />
                        </div>

                    </div>
                    <div className="introduction-div">
                        <p>Bemutatkozás</p>
                        <div>
                            <Editor
                                headerTemplate={editorHeader}
                                value={newAd.introduction}
                                onTextChange={(e) => setNewAd({
                                        ...newAd, introduction: e.htmlValue
                                    }
                                )}
                                style={{height: "30vh"}}
                            />
                        </div>

                    </div>
                    <div className="timetable-div">
                        <p>Órarend</p>
                        <Timetable timetable={newAd.timetable}
                                   setNewAdvertisement={setNewAd}
                                   readonly={false}
                        />
                    </div>
                    <div className="active-div">
                        <p>Szeretném, ha a hirdetésem megjelenne az oldal hirdetései között!</p>
                        <Checkbox checked={newAd.active}
                                  onChange={(e) => setNewAd({
                                          ...newAd, active: e.checked
                                      }
                                  )}
                                  disabled={false}
                        >
                        </Checkbox>
                    </div>
                    <div className="submit-button-div">
                        <Button label="Mentés"
                                onClick={() => onSubmit()}
                        />
                    </div>
                </div>
                : <div className="progress-spinner-div">
                    <ProgressSpinner/>
                </div>
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

export default connect(mapStateToProps)(Ad);