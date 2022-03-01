import {connect} from "react-redux";
import {addLocale} from "primereact/api";
import {addLocaleHu} from "../../util/CalendarHu";
import {Controller, useForm} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import "../../assets/css/profile.css"
import {editorHeader, genderList, subjectList} from "../../util/FormFields";
import Swal from "sweetalert2";
import {updateDisplayName} from "../../redux/actions/authActions";
import {classNames} from "primereact/utils";
import {Button} from "primereact/button";
import {UserService} from "../../services/UserService";
import StarRatings from "react-star-ratings/build/star-ratings";
import {MultiSelect} from "primereact/multiselect";
import {Chips} from "primereact/chips";
import {Editor} from "primereact/editor";
import {useState} from "react";

const ProfessionalData = (props) => {
    const {firebaseAuth, professionalData, updateDisplayName} = props;
    const [selectedSubjects, setSelectedSubjects] = useState(null);
    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues: professionalData});

    const onSubmit = (data) => {
        console.log(data)
        updateDisplayName(data.lastName + ' ' + data.firstName);
        UserService.updatePersonalData(firebaseAuth.uid, data)
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
                    title: "Hiba történt az adatok módosítása során!",
                    allowOutsideClick: false,
                });
            })
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <span className="error">{errors[name].message}</span>
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
                <div className="profile-content">
                    <div className="profile-text-content">
                        <div className="profile-text-row">
                            <p>Képzettség</p>
                            <InputText placeholder="vezeteknev"/>
                        </div>
                        <div className="profile-text-row">
                            <p>Oktatott tárgyak</p>
                            <div className="profile-multiSelectDiv">
                                <MultiSelect className="profile-multiSelect"
                                             value={selectedSubjects}
                                             options={subjectList}
                                             onChange={(e) => setSelectedSubjects(e.value)}
                                             optionLabel="name"
                                             placeholder="Tantárgyak"
                                             showClear
                                             filter
                                             filterBy="name"
                                             filterMatchMode="startsWith"
                                             emptyFilterMessage="Nem található..."
                                             selectedItemsLabel={"(" + (selectedSubjects ? selectedSubjects.size : 0) + ")"}

                                />
                            </div>
                        </div>
                        <div className="profile-text-row3">
                            <Chips value={selectedSubjects ? selectedSubjects.map(s => s.name) : null}
                                   separator=","
                                   disabled
                            />
                        </div>
                        <div className="profile-text-row2">
                            <p>Bemutatkozás</p>
                            <div>
                                <Editor
                                    headerTemplate={editorHeader}
                                    value={null}
                                    onTextChange={(e) => ({})}
                                    style={{height: "250px"}}
                                />
                            </div>
                        </div>
                        <div className="profile-text-row">
                            <p>Oktatott tárgyak</p>
                            <Dropdown className="profile-dropdown"> </Dropdown>
                        </div>
                    </div>
                    <div className="profile-stars">
                        <p className="profile-stars-number">4.2</p>
                        <StarRatings
                            title="asdasd"
                            rating={4.2}
                            starRatedColor="orange"
                            numberOfStars={5}
                            starDimension={"40px"}
                            name='rating'
                        />
                        <p className="profile-stars-text">15 visszajelzés alapján</p>
                    </div>
                </div>
        </form>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        firebaseAuth: state.firebase.auth,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateDisplayName: displayName => dispatch(updateDisplayName(displayName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfessionalData);