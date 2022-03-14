import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import "../../assets/css/tutor/timetable.css"
import {Button} from "primereact/button";

const Timetable = (props) => {
    const {timetable, setNewAdvertisement, setDisplayTimetable} = props;

    const header = () => {
        return (
            <div className="flex justify-content-between align-items-center">
                <h1>Órarend</h1>
                <Button icon="pi pi-times"
                        className="p-button-rounded p-button-danger p-button-outlined"
                        onClick={() => setDisplayTimetable(false)}
                />
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
                              setNewAdvertisement((oldAdvertisement) => {
                                  return {
                                      ...oldAdvertisement,
                                      timetable:
                                          oldAdvertisement.timetable.map((row, idx) => {
                                              return idx === columnData.rowIndex
                                                  ? {...row, [columnData.field]: "closed"}
                                                  : row
                                          })

                                  }
                              })
                          }}
                />
                : <Button label="ZÁRT"
                          className="p-button-raised p-button-danger"
                          onClick={() => {
                              setNewAdvertisement((oldAdvertisement) => {
                                  return {
                                      ...oldAdvertisement,
                                      timetable:
                                          oldAdvertisement.timetable.map((row, idx) => {
                                              return idx === columnData.rowIndex
                                                  ? {...row, [columnData.field]: "open"}
                                                  : row
                                          })

                                  }
                              })
                          }}
                />
        );
    }

    console.log(timetable)

    return (
        <div className="timetable-container">
            <DataTable value={timetable}
                       responsiveLayout="scroll"
                       header={header}
                       emptyMessage="Töltés..."
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