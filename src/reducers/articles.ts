// import { Folder } from '@sensenet/default-content-types';
import { IODataParams, Repository } from '@sensenet/client-core';
import { article } from './article';

export const loadArticles = (path: string, options: IODataParams<any> = {}) => ({
    type: 'LOAD_ARTICLES',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.loadCollection({
            path,
            oDataOptions: options,
        });
        console.log('LOAD_ARTICLES');
        // console.log(data.d);
        return { tag: path.substring(path.lastIndexOf('/') + 1), articles: data.d };
    },
});

export const articles = (
    state: {
        isDataLoading: boolean,
        isDataFetched: boolean,
        articles: Array<any>,
        loadedTags: Array<string>
    } = {
        isDataLoading: true, 
        isDataFetched: false,
        articles: [],
        loadedTags: []
    }, action: any) => {

    switch (action.type) {
        case 'LOAD_ARTICLES': {
            return {
                ...state,
                isDataLoading: true,
                isDataFetched: false
            };
        }
        case 'LOAD_ARTICLE_SUCCESS': {
            let newArt = article({}, action);
            return {
                ...state,
                articles: state.articles.findIndex(c => c.Id === newArt.Id) > -1 ? state.articles : [...state.articles, newArt]
            };
        }
        case 'LOAD_ARTICLES_SUCCESS': {
            // console.log('articles load');
            // console.log(action.payload);
            
            return {
                ...state,
                isDataLoading: false,
                isDataFetched: true,
                // articles: [...state.articles, action.payload.results.map()]
                // articles: Array.from(new Set([...state.articles, ...action.payload.articles.results])),
                articles: [...action.payload.articles.results, ...state.articles].filter((s1, pos, arr) => arr.findIndex((s2) => s2.Id === s1.Id) === pos),
                // articles: action.payload.articles.results,
                loadedTags: Array.from(new Set([...state.loadedTags, action.payload.tag]))
            };
        }
        case 'LOAD_ARTICLES_FAILURE': {
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
