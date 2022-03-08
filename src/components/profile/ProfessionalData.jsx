import {connect} from "react-redux";
import {Controller, useForm} from "react-hook-form";
import {Dropdown} from "primereact/dropdown";
import "../../assets/css/profile/professional-data.css"
import {editorHeader, educationLevelList, subjectsList} from "../../util/FormFields";
import Swal from "sweetalert2";
import {Button} from "primereact/button";
import {UserService} from "../../services/UserService";
import StarRatings from "react-star-ratings/build/star-ratings";
import {MultiSelect} from "primereact/multiselect";
import {Editor} from "primereact/editor";
import {Divider} from "primereact/divider";
import {Dialog} from "primereact/dialog";
import {useState} from "react";
import Timetable from "./Timetable";
import {cloneDeep} from "lodash";

const ProfessionalData = (props) => {
    const {auth, professionalData} = props;
    const {control, formState: {errors}, handleSubmit} = useForm({defaultValues: professionalData});
    const [displayTimetable, setDisplayTimetable] = useState(false);
    const [timetable, setTimetable] = useState(professionalData.timetable)

    const onSubmit = (data) => {
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            title: "Módosítás...",
            allowOutsideClick: false,
        });
        UserService.updateProfessionalData(auth.uid, {...data, timetable: timetable})
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
        return errors[name] && <span className="sign-up-error">{errors[name].message}</span>
    };

    const subjectsFooterTemplate = (subjects) => {
        const length = subjects.value ? subjects.value.length : 0;
        return (
            <div className="py-2 px-3">
                <b>{length} db tárgy kiválasztva.</b>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="professional-data-field-container">
                <div className="professional-data-fields">
                    <div className="professional-data-field">
                        <div className="professional-data-field-data">
                            <p>Legmagasabb iskolai végzettség</p>
                            <span>
                                <Controller name="educationLevel"
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <Dropdown value={field.value}
                                                          options={educationLevelList}
                                                          onChange={(e) => field.onChange(e.target.value)}
                                                          optionLabel="name"
                                                          placeholder="Válassz végzettséget"
                                                />
                                            )}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="professional-data-field">
                        <div className="professional-data-field-data">
                            <div className="subjects-div">
                                <p>Oktatni kívánt tárgyak</p>
                                <p>A kereső ezek alapján fog szűrni!</p>
                            </div>
                            <span>
                                <Controller name="subjects"
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <MultiSelect value={field.value}
                                                             options={subjectsList}
                                                             onChange={(e) => field.onChange(e.target.value)}
                                                             optionLabel="name"
                                                             placeholder="Válassz tantárgyat"
                                                             filter
                                                             display={"chip"}
                                                             panelFooterTemplate={subjectsFooterTemplate}
                                                />
                                            )}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="professional-data-field">
                        <div className="professional-data-field-data">
                            <p>Bemutatkozás</p>
                            <span className="introduction-span">
                                <Controller name="introduction"
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <Editor
                                                    headerTemplate={editorHeader}
                                                    value={field.value}
                                                    onTextChange={(e) => field.onChange(e.htmlValue)}
                                                    style={{height: "30vh"}}
                                                />
                                            )}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="professional-data-field">
                        <Button type="button"
                                label="Órarend beállítása"
                                className="timetable p-button-raised p-button-secondary"
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
                            <Timetable timetable={cloneDeep(timetable)} setTimetable={setTimetable}/>
                        </Dialog>
                    </div>
                    <Divider layout="horizontal"/>
                    <div className="professional-data-field">
                        <div className="professional-data-field-data">
                            <p className="ratings">Értékelésem</p>
                            <div className="ratings-div">
                                <div>
                                    <span>4.2</span>
                                    <div>
                                        <StarRatings title="asdasd"
                                                     rating={4.2}
                                                     starRatedColor="orange"
                                                     numberOfStars={5}
                                                     starDimension={"4vh"}
                                                     name='rating'
                                        />

                                        <p>15 visszajelzés alapján</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="professional-data-button-container">
                <Button type="submit"
                        label="Módosítások mentése"
                        className="professional-data-submit-button p-button-success"
                />
            </div>
        </form>
    )
}

const mapStateToProps = state => {
    return {
        auth: state.firebase.auth,
    };
};

export default connect(mapStateToProps)(ProfessionalData);