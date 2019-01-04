import 'babel-polyfill';
import * as React                           from 'react';
import * as ReactDOM                        from 'react-dom';
import { Provider }                         from 'react-redux';
import { combineReducers }                  from 'redux';
import './index.css';

import { JwtService }                       from '@sensenet/authentication-jwt';
import { Repository }                       from '@sensenet/client-core';
import { Reducers, Store }                  from '@sensenet/redux';

// custrom  reducers  
// import user                                 from './reducers/users';

import { 
    BrowserRouter
}                                           from 'react-router-dom'; 

import App                                  from './App';
const DATA = require('./config.json');

const sensenet = Reducers.sensenet;
const myReducer = combineReducers({ 
  sensenet,  
});

let envApiUrl = process.env.REACT_APP_API_URL; // 'https://data.%sitename%.hu'; 
if (envApiUrl) {
    var fullWPort = window.location.host.split(':');
    var full = fullWPort[0];
    // window.location.host is subdomain.domain.com
    var parts = full.split('.');
    // var type = parts[parts.length];
    var domain = parts[parts.length - 1];
    // var sub = parts[0];
    
    envApiUrl = envApiUrl.replace('%sitename%', domain);
    // alert(envUrl);
}

const repository = new Repository ({
    repositoryUrl: envApiUrl || DATA.apiUrl 
});
const jwtService = new JwtService(repository);
jwtService.checkForUpdate();

const options = {
    repository,
    rootReducer: myReducer,
} as Store.CreateStoreOptions<any>;
  
const store = Store.createSensenetStore(options);

ReactDOM.render(
    (
        <div>
            <span className="hidden">hello world!</span>
        <Provider store={store}>
            <BrowserRouter basename="/">
                    <App />
            </BrowserRouter>
        </Provider>
        </div>
    ),
    document.getElementById('root')
);