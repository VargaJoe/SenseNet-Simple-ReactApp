// import { Folder } from '@sensenet/default-content-types';
import { IODataParams, Repository } from '@sensenet/client-core';
import { category } from './category';

export const loadCategories = (path: string, options: IODataParams<any> = {}) => ({
    type: 'LOAD_CATEGORIES',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.loadCollection({
            path,
            oDataOptions: options,
        });
        console.log('LOAD_CATEGORIES');
        // console.log(data.d);
        return data.d;
    },
});

export const categories = (
    state: {
        isDataLoading: boolean,
        isDataFetched: boolean,
        categories: Array<any>
    } = {
        isDataLoading: true, 
        isDataFetched: false,
        categories: []
    }, action: any) => {

    switch (action.type) {
        case 'LOAD_CATEGORIES': {
            return {
                ...state,
                isDataLoading: true,
                isDataFetched: false
            };
        }
        case 'LOAD_CATEGORY_SUCCESS': {
            let newCat = category({}, action);
            return {
                ...state,
                // categories: Array.from(new Set([...state.categories, category({}, action)]))
                // categories: [...state.categories.filter(cat => cat.Id !== newCat.Id), newCat]
                // categories: Array.from(new Set([...state.categories, newCat]))
                categories: state.categories.findIndex(c => c.Id === newCat.Id) > -1 ? state.categories : [...state.categories, newCat]
            };
        }
        case 'LOAD_CATEGORIES_SUCCESS': {
            // console.log('reducer');
            // console.log(action.payload.results);
            // console.log(state.categories);
            // let filteredPaload = action.payload.results.filter((cat: any) => !state.categories.includes(cat));
            return {
                ...state,
                isDataLoading: false,
                isDataFetched: true,
                // categories: Array.from(new Set([...state.categories, ...action.payload.results]))
                // categories: [...state.categories, action.payload.results]
                // categories: [...state.categories, ...action.payload.results]
                // categories: action.payload.results
                categories: [...action.payload.results, ...state.categories].filter((s1, pos, arr) => arr.findIndex((s2) => s2.Id === s1.Id) === pos)
                
            };
        }
        case 'LOAD_CATEGORIES_FAILURE': {
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
