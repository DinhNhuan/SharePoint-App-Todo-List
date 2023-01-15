import * as React from 'react';

interface Props {
    message: string;
}

const Loading: React.FC<Props> = ({ message }) => {
    return (
        <div>
            <p>{message}</p>
            <div className="loading-spinner"></div>
        </div>
    );
};

export default Loading;