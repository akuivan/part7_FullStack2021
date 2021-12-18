const initialState = null

const notificationReducer = (state = initialState, action) => {
    console.log(action)

    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.notification
        default:
            return state
    }
}

export const setNotification = (notification, type) => {
    if (!type) {
        type = 'success'
    }

    return async dispatch => {
        dispatch({
            type: 'SET_NOTIFICATION',
            notification: {
                content: notification,
                type: type
            }
        })
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
    }
}
const clearNotification = () => {
    return {
        type: 'SET_NOTIFICATION',
        notification: null
    }
}

export default notificationReducer
