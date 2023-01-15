import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { getSP } from './pnpjsConfig';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import CrudProject from './components/CrudProject';

export interface ICrudProjectWebPartProps {
    description: string;
}

export default class CrudProjectWebPart extends BaseClientSideWebPart<ICrudProjectWebPartProps> {

    public render(): void {
        const element: React.ReactElement = React.createElement(CrudProject, {});
        ReactDom.render(element, this.domElement);
    }

    protected async onInit(): Promise<void> {
        await getSP(this.context);
        // initialization logic
    }
}
