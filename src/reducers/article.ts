// import { Folder } from '@sensenet/default-content-types';
import { IODataParams, Repository } from '@sensenet/client-core';

// export const loadArticle = (path: string, options: IODataParams<any> = {}) => ({    
//     type: 'LOAD_ARTICLE',
//     async payload(repository: Repository) {
//         const data = await repository.load({
//             idOrPath: path,
//             oDataOptions: options,
//         });
//         return data.d;
//     },
// });

export const loadArticle = (path: string, options: IODataParams<any> = {}) => ({
    type: 'LOAD_ARTICLE',
    // tslint:disable:completed-docs
    async payload(repository: Repository) {
        const data = await repository.loadCollection({
            path,
            oDataOptions: options,
        });
        console.log('load article action');
        console.log(data.d.results[0]);
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
