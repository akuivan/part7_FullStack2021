
const userReducer = (state = [], action) => {
    console.log('state now: ', state)
    console.log('action', action)

    switch (action.type) {
        case 'SET_USER':
            return action.data
        default:
            return state
    }
}

export const setUser = (user) => {
    return async dispatch => {
        dispatch({
            type: 'SET_USER',
            data: user
        })
    }
}

export default userReducer