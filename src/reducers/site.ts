// import { welcome } from './welcome';
import { categories } from './categories';
import { articles } from './articles';

// reducer
export const site = (
    state: {
        site: any
    } = {
        site: {}
    }, action: any) => {

        switch (action.type) {
            case 'LOAD_CATEGORIES_SUCCESS': {
                // console.log('sitereducer');
                return {
                    ...state,
                    articles,
                    categories
                };
            }
            default: {
                return {
                    ...state,
                    // welcome,
                    articles,
                    categories
                };
            }
        }
};