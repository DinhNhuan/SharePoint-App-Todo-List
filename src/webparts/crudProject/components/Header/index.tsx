import * as React from 'react';
import { Link } from 'react-router-dom';

export class Header extends React.Component<{}, {}> {
    public render(): React.ReactElement<{}> {
        return (
            <div>
                <Link to="/" >Home</Link> |
                <Link to="/todo-form" > Add item </Link> |
                <Link to="/todo-list" > Todo List </Link>
            </div>
        );
    }
}
