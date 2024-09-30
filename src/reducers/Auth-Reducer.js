export default function AuthReducer (state , action) {
    switch(action.type){
        case 'LOGIN' : {
            return {...state, isLoggedIn:true , user : action.payload}
        }
        case 'FOLLOW' : {
            const isFollowing = state.user.following.includes(action.payload)
            return{...state , user : {...state.user, following: isFollowing? state.user.following.filter(e=>e !== action.payload) :
                [...state.user.following , action.payload ]
            }}
        }
        case 'UPDATE_USER' : {
            return{...state , user : action.payload}
        }
    }
}