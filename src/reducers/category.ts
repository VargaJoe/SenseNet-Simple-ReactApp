// import { Folder } from '@sensenet/default-content-types';
import { IODataParams, Repository } from '@sensenet/client-core';

export const loadCategory = (path: string, options: IODataParams<any> = {}) => ({
    type: 'LOAD_CATEGORY',
    async payload(repository: Repository) {
        const data = await repository.load({
            idOrPath: path,
            oDataOptions: options,
        });
        // console.log('action');
        // console.log(data.d);
        return data.d;
    },
});

export const category = (state: {}, action: any) => {
    switch (action.type) {
        case 'LOAD_CATEGORY_SUCCESS': {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};
