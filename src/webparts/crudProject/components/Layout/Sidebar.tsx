import * as React from 'react';

interface Props {
    items: { title: string, link: string }[]
}

const Sidebar: React.FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="sidebar">
            <h3>Sidebar</h3>
            <ul>
                {props.items.map((item, index) => (
                    <li key={index}>
                        <a href={item.link}>{item.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;