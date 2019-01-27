// import { Folder } from '@sensenet/default-content-types';
import { IODataParams, Repository } from '@sensenet/client-core';

export const LoadArticle = (path: string, options: IODataParams<any> = {}) => ({    
    type: 'LOAD_ARTICLE',
    async payload(repository: Repository) {
        const data = await repository.load({
            idOrPath: path,
            oDataOptions: options,
        });
        return data.d;
    },
});

export const siteArticle = (
    state: {   
        articles: any
        translations: any
        loadedTags: Array<string>
    } = {
        articles: [],
        translations: [],
        loadedTags: []
    }, action: any) => {

    switch (action.type) {
        case 'LOAD_ARTICLE': {
            return {
                ...state,
                isLoading: true,
            };
        }
        case 'LOAD_ARTICLE_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                isDataFetched: true,
                articles: [...state.articles, action.payload]
            };
        }
        case 'LOAD_ARTICLE_FAILURE': {
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
