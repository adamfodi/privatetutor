export const createEmptyTimetable = () => {
    let timetable = []
    const rowTemplate = {
        timeInterval: {from: null, to: null},
        index: null,
        monday: "closed",
        tuesday: "closed",
        wednesday: "closed",
        thursday: "closed",
        friday: "closed",
        saturday: "closed",
        sunday: "closed",
    }

    for (let i = 8; i < 20; i++) {
        timetable.push({
            ...rowTemplate,
            timeInterval: {
                from: convertDigitToHour(i),
                to: convertDigitToHour(i + 1),
            }
        })
    }
    return timetable;
};

const convertDigitToHour = (digit) => {
    if (digit.toString().length === 1) {
        return '0' + digit + ':00'
    }
    return digit + ':00'
}