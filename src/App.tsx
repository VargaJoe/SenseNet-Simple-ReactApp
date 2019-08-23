import * as React       from 'react';
import                  './App.css';
import Body             from './components/Body';

export interface AppProps {
    store: any;
    repository: any;
}

class App extends React.Component<AppProps, any> {
    constructor(props: any) {
        super(props);       
    }

    public render() {      
        return (               
                <Body />      
        );
    } 
}

export default (App as any);