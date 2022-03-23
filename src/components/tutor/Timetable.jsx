import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import "../../assets/css/tutor/timetable.css"
import {Button} from "primereact/button";

const Timetable = (props) => {
    const {timetable, setNewAdvertisement, readonly} = props;

    const partOfTheDayTemplate = (rowData) => {
        switch (rowData.partOfTheDay) {
            case 'morning':
                return <span className="partoftheday-span">
                Délelőtt
            </span>
            case 'afternoon':
                return <span className="partoftheday-span">
                Délután
            </span>
            default:
                return <span className="partoftheday-span">
                Este
            </span>
        }
    }

    const dayTemplate = (rowData, columnData) => {
        return (
            rowData[columnData.field] === "open"
                ? <Button className="p-button-raised p-button-success"
                          icon="pi pi-check"
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
                          disabled={readonly}
                />
                : <Button className="p-button-raised p-button-danger"
                          icon="pi pi-times"
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
                          disabled={readonly}
                />
        );
    }

    console.log(timetable)

    return (
        <div className="timetable-content">
            <DataTable value={timetable}
                       responsiveLayout="scroll"
                       emptyMessage="Töltés..."
            >
                <Column field="partOfTheDay"
                        header="Napszak"
                        body={partOfTheDayTemplate}
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