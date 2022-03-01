import React from "react";

export const genderList = ["Férfi", "Nő", "Egyéb"];

export const subjectList = [
    {name: "Matematika"},
    {name: "Fizika"},
    {name: "Kémia"},
    {name: "Biológia"},
    {name: "Földrajz"},
    {name: "Informatika"},
    {name: "Történelem"},
    {name: "Irodalom"},
    {name: "Nyelvtan"},
    {name: "Ének"}
]

export const addLocaleHu = {
    firstDayOfWeek: 1,
    dayNames: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"],
    dayNamesShort: ["Vasá", "Hétf", "Kedd", "Szer", "Csüt", "Pént", "Szom"],
    dayNamesMin: ["Va", "Hé", "Ke", "Sz", "Cs", "Pé", "Sz"],
    monthNames: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sze", "Okt", "Nov", "Dec"],
    today: 'Ma',
    clear: 'Tisztítás',
    weekHeader: 'Hét'
};

export const editorHeader = (
    <div id="standalone-container">
        <div id="toolbar-container">
                <span className="ql-formats">
                    <select className="ql-size"/>
                </span>
            <span className="ql-formats">
                    <button className="ql-bold"/>
                    <button className="ql-italic"/>
                    <button className="ql-underline"/>
                </span>
            <span className="ql-formats">
                    <select className="ql-color"/>
                    <select className="ql-background"/>
                </span>
            <span className="ql-formats">
                    <button className="ql-blockquote"/>
                    <button className="ql-code-block"/>
                    <button className="ql-link"/>
                </span>
            <span className="ql-formats">
                    <button className="ql-list" value="ordered"/>
                    <button className="ql-list" value="bullet"/>
                </span>
            <span className="ql-formats">
                    <select className="ql-align"/>
                </span>
            <span className="ql-formats">
                    <button className="ql-script" value="sub"/>
                    <button className="ql-script" value="super"/>
                </span>
        </div>
    </div>
);

