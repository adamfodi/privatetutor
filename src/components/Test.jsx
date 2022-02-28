import {cloneDeep} from "lodash";

export const Test = () => {

    const x = {
        a: 5,
        b: [1, 2, 3, 4, 5],
        c: {
            c1: 66,
            c2: [2, 3, 4, 5],
            c3: {asd: 5, def: 6}
        }
    }

    const n = cloneDeep(x);

    console.log(x)
    console.log(n)


    n.c.c1=99;
    console.log(x)
    console.log(n)





    return (
        <>
        </>

    )
}