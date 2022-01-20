import './App.css';
import "primereact/resources/themes/luna-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";

function App() {
    return (
            <BrowserRouter>
                <Navbar/>
                    <Routes>
                        <Route path="signin/*" element={<SignIn/>}/>
                        <Route path="signup/*" element={<SignUp/>}/>
                        <Route path="/" element={<SignIn/>}/>
                    </Routes>
            </BrowserRouter>
    );
}

export default App;
