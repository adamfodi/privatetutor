import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import "../../assets/css/profile/timetable.css"
import {Button} from "primereact/button";

const Timetable = (props) => {
    const {timetable, setTimetable} = props;

    const header = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0">Órarend</h5>
                <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined" />
            </div>
        )
    }

    const timeIntervalTemplate = (rowData) => {
        return (
            <span className="time-interval-span">
                {rowData.timeInterval.from}
                &nbsp;-&nbsp;
                {rowData.timeInterval.to}
            </span>
        );
    }

    const dayTemplate = (rowData, columnData) => {
        return (
            rowData[columnData.field] === "open"
                ? <Button label="NYITOTT"
                          className="p-button-raised p-button-success"
                          onClick={() => {
                              const newTimetable = [...timetable];
                              newTimetable[columnData.rowIndex][columnData.field] = "closed";
                              console.log(newTimetable)
                              setTimetable(newTimetable);
                          }}
                />
                : <Button label="ZÁRT"
                          className="p-button-raised p-button-danger"
                          onClick={() => {
                              const newTimetable = [...timetable];
                              newTimetable[columnData.rowIndex][columnData.field] = "open";
                              console.log(newTimetable)
                              setTimetable(newTimetable);
                          }}
                />
        );
    }

    return (
        <div className="timetable-container">
            <DataTable value={timetable}
                       responsiveLayout="scroll"
                       header={header}
            >
                <Column field="timeInterval"
                        header="Idősáv"
                        body={timeIntervalTemplate}
                />
                <Column field="monday"
                        header="Hétfő"
                        body={(rowData, columnData) => dayTemplate(rowData, columnData)}
                />
                <Column field="tuesday"
                        header="Kedd"
                        body={(rowData, columnData) => dayTemplate(rowData, columnData)}
                />
                <Column field="wednesday"
                        header="Szerda"
                        body={(rowData, columnData) => dayTemplate(rowData, columnData)}
                />
                <Column field="thursday"
                        header="Csütörtök"
                        body={(rowData, columnData) => dayTemplate(rowData, columnData)}
                />
                <Column field="friday"
                        header="Péntek"
                        body={(rowData, columnData) => dayTemplate(rowData, columnData)}
                />
                <Column field="saturday"
                        header="Szombat"
                        body={(rowData, columnData) => dayTemplate(rowData, columnData)}
                />
                <Column field="sunday"
                        header="Vasárnap"
                        body={(rowData, columnData) => dayTemplate(rowData, columnData)}
                />
            </DataTable>
        </div>
    )
}

export default Timetable;