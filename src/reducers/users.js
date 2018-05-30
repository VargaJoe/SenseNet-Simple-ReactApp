
export default function updateInfo(state = {}, action) {
    if (action.type === 'UPDATE_LOGINED_USER') {

        return {
            ...state,
            user: action.payload
        };
    }
    if (action.type === 'SET_USER_INFO') {
        return  {
            ...state,
            user: {
                BirthDate: 		action.payload.BirthDate,
                Description: 	action.payload.Description,
                Education: 		action.payload.Education,	
                Email: 			action.payload.Email,
                FullName :      action.payload.FullName,
                JobTitle: 		action.payload.JobTitle,
				Languages: 		action.payload.Languages,
				Phone: 			action.payload.Phone,
				
            }
        }
    }
    return state;
}
