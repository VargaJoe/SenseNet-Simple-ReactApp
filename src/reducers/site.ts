// import { welcome } from './welcome';
import { categories } from './categories';

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
                    categories
                };
            }
            default: {
                return {
                    ...state,
                    // welcome,
                    categories
                };
            }
        }
};