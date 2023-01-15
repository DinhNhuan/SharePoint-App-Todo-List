import * as React from 'react';
// import styles from './CrudProject.module.scss';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

// import Layout from './Layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { Header } from './Header';
import NavigationBar from "./NavigationBar"
import { SPFI } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import { getSP } from "../pnpjsConfig";



const CrudProject: React.FunctionComponent<{}> = () => {

    const [serverRelativeUrl, setServerRelativeUrl] = React.useState("")

    React.useEffect(() => {
        const getServerRelativeUrl = async () => {
            const _sp: SPFI = getSP();
            _sp.web.select("ServerRelativeUrl")().then(webInfo => {
                setServerRelativeUrl(`${webInfo.ServerRelativeUrl}/_layouts/15/workbench.aspx`);
            })
        }
        getServerRelativeUrl();

    }, [])

    return (
        <div>
            <BrowserRouter basename={serverRelativeUrl}>
                <NavigationBar />
                {/* <Header /> */}




                <Routes>
                    <Route path="/todo-form" element={<TodoForm />} />
                    <Route path="/todo-list" element={<TodoList />} />
                </Routes>
            </BrowserRouter>

        </div >

    );
}

export default CrudProject

