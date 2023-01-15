import * as React from 'react';
import Sidebar from './Sidebar';
import styles from './Layout.module.scss';

interface Props {
}

interface State {
}

const items = [
    { title: 'Home', link: '/' },
    { title: 'Todo list', link: '/todo-list' },
    { title: 'New item', link: '/todo-form' },
];


class Layout extends React.Component<Props, State> {
    public render(): JSX.Element {
        return (
            <div className={styles.layoutContainer}>
                <div className={styles.sidebar}>
                    <Sidebar items={items} />
                </div>
                <div className={styles.article}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Layout;