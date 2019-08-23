import { IODataParams, Repository } from '@sensenet/client-core';

export const loadArticle = (path: string, options: IODataParams<any> = {}) => ({
    type: 'LOAD_ARTICLE',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.loadCollection({
            path,
            oDataOptions: options,
        });
        console.log('LOAD_ARTICLE');
        return data.d.results[0];
    },
});

export const article = (state: {}, action: any) => {
    switch (action.type) {
        case 'LOAD_ARTICLE_SUCCESS': {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};
