import { IODataParams, Repository } from '@sensenet/client-core';

// action
export const loadWelcome = (path: string, options: IODataParams<any> = {}) => ({    
    type: 'LOAD_INFO',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.load({
            idOrPath: path,
            oDataOptions: options,
        });
        // console.log('welcome action');
        // console.log(data.d);
        return data.d;
    },
});

// reducer
export const welcome = (
    state: {
        isDataLoading: boolean, 
        isDataFetched: boolean,
        welcome: any
    } = {
        isDataLoading: true, 
        isDataFetched: false,
        welcome: {}
    }, action: any) => {

    switch (action.type) {
        case 'LOAD_INFO': {
            return {
                ...state,
                isDataLoading: true,
            };
        }
        case 'LOAD_INFO_SUCCESS': {
            const newLocal = action.payload;
            return {
                ...state,
                isDataLoading: false,
                isDataFetched: true,
                welcome: newLocal
            };
        }
        case 'LOAD_INFO_FAILURE': {
            return {
                ...state,
                isDataLoading: false,
                isDataFetched: false
            };
        }   
        default: {
            return state;
        }
    }
};
