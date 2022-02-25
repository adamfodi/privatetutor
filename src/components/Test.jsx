import {Sidebar} from "primereact/sidebar";
import {useState} from "react";
import {Button} from "primereact/button";
import {Card} from "primereact/card";

export const Test = () => {
    const [visibleLeft,setVisibleLeft] = useState(false);


    return (
        <>
            <div>
                <Button label="Left" onClick={() => setVisibleLeft(!visibleLeft)}/>
            </div>
            <Sidebar
                visible={visibleLeft}
                onHide={() => setVisibleLeft(false)}
                style={{marginLeft: "40px",marginTop: "200px"}}
                modal={false}
                showCloseIcon={false}
                baseZIndex={0}
            >
                <h3>Left Sidebar</h3>
            </Sidebar>
            <Card style={{width:"900px", height:"200px"}}>

            </Card>

        </>

    )
}