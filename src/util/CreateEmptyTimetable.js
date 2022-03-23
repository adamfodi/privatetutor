export const createEmptyTimetable = () => {
    let timetable = []
    const rowTemplate = {
        partOfTheDay: null,
        monday: "closed",
        tuesday: "closed",
        wednesday: "closed",
        thursday: "closed",
        friday: "closed",
        saturday: "closed",
        sunday: "closed",
    }

    timetable.push({...rowTemplate,partOfTheDay: 'morning'})
    timetable.push({...rowTemplate,partOfTheDay: 'afternoon'})
    timetable.push({...rowTemplate,partOfTheDay: 'evening'})

    return timetable;
};
