import {useEffect, useState} from "react";

export const Test = (props) => {
    const [counter, setCounter] = useState(100)

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);


    return (
        <>
            <h1>{counter}</h1>
            <h2>{props.txt}</h2>

        </>

    )
}