import "../../assets/css/profile/feedback.css"
import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";

const Feedback = (props) => {
    const {feedback} = props

    moment.locale('hu')

    const ratingBodyTemplate = (rowData) => {
        return (
            <div>
                <p>
                    {rowData.rating}
                </p>
                <i className="pi pi-star"/>
            </div>
        )
    }

    const feedbackBodyTemplate = (rowData) => {
        return (
                <p>
                    {rowData.message}
                </p>
        )
    }

    const dateBodyTemplate = (rowData) => {
        return (
                <p>
                    {moment(rowData.date.toDate()).format('YYYY. MMMM DD.')}
                </p>
        )
    }

    return (
        <div className="feedback-container">
            <div className="sum">
                <p>{feedback.sum}</p>
                <i className="pi pi-star-fill"/>
            </div>
            <div className="feedback-table">
                <DataTable
                    value={feedback.list}
                    responsiveLayout="scroll"
                    paginator
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Visszajelzések száma: {totalRecords}"
                    rows={5}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    sortField="date"
                    sortOrder={-1}
                    emptyMessage="Nem található visszajelzés."
                >
                    <Column
                        field="rating"
                        header="Értékelés"
                        body={ratingBodyTemplate}
                        sortable
                        className="rating-td"
                    />

                    <Column
                        field="message"
                        header="Visszajelzés"
                        body={feedbackBodyTemplate}
                        className="feedback-td"
                    />

                    <Column
                        field="date"
                        header="Dátum"
                        body={dateBodyTemplate}
                        sortable
                        className="date-td"
                    />

                </DataTable>
            </div>
        </div>

    )
}
export default Feedback;