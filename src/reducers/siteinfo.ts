// import { Folder } from '@sensenet/default-content-types';
import { IODataParams, Repository } from '@sensenet/client-core';

// export const loadInfo = (path: string, options: IODataParams<Folder> = {}) => ({
export const loadInfo = (path: string, options: IODataParams<any> = {}) => ({    
    type: 'LOAD_INFO',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.loadCollection({
            path,
            oDataOptions: options,
        });
        return data.d.results;
    },
});

export const siteInfo = (
    state: {
        isLoading: boolean, 
        isDataFetched: boolean,
        info: any, 
        siteName: string,
        welcome: any
    } = {
        isLoading: true, 
        isDataFetched: false,
        info: {} as any, 
        siteName: '',
        welcome: {}
    }, action: any) => {

    switch (action.type) {
        case 'LOAD_INFO': {
            return {
                ...state,
                isLoading: true,
            };
        }
        case 'LOAD_INFO_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                isDataFetched: true,
                siteInfo: action.payload.info
            };
        }
        case 'LOAD_INFO_FAILURE': {
            return {
                ...state,
                isLoading: false,
                isDataFetched: false
            };
        }   
        default: {
            return state;
        }
    }
};
