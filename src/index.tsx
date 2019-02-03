import 'babel-polyfill';
import * as React                           from 'react';
import * as ReactDOM                        from 'react-dom';
import { Provider }                         from 'react-redux';
import { combineReducers }                  from 'redux';
import { Helmet } from 'react-helmet';

import './index.css';

import { JwtService }                       from '@sensenet/authentication-jwt';
import { Repository }                       from '@sensenet/client-core';
import { Reducers, Store }                  from '@sensenet/redux';
import { welcome }                         from './reducers/welcome';
// import { site }                         from './reducers/site';
import { categories }                         from './reducers/categories';
import { articles }                         from './reducers/articles';

// custrom  reducers  
// import user                                 from './reducers/users';

import { 
    BrowserRouter
}                                           from 'react-router-dom'; 

import App                                  from './App';
const DATA = require('./config.json');
let siteTitle = process.env.REACT_APP_SITE_TITLE || DATA.siteTitle;

const sensenet = Reducers.sensenet;
const myReducer = combineReducers({ 
  sensenet, 
  site: combineReducers({ 
        welcome,
        categories,
        articles,
  })
});

let envApiUrl = process.env.REACT_APP_API_URL || DATA.apiUrl; // 'https://data.%sitename%.hu'; 

if (envApiUrl) {
    var fullWPort = window.location.host.split(':');
    var full = fullWPort[0];
    // window.location.host is subdomain.domain.com
    var parts = full.split('.');
    
    // var type = parts[parts.length - 1];
    var domain = (parts.length > 1) ? parts[parts.length - 2] : parts[parts.length - 1];
    // var sub = parts[0];
    
    envApiUrl = envApiUrl.replace('%sitename%', domain);
    // alert(envUrl);
    window.name = domain;
}

const repository = new Repository ({
    repositoryUrl: envApiUrl  
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
            <Helmet>
                <meta charSet="utf-8" />
                <title>{siteTitle}</title>
                <link rel="canonical" href="https://maindomain" />
            </Helmet>
            <Provider store={store}>
                <BrowserRouter basename="/">
                        <App />
                </BrowserRouter>
            </Provider>
        </div>
    ),
    document.getElementById('root')
);