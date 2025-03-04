import {configureStore, createSlice} from '@reduxjs/toolkit';

let userSlice = createSlice({
    name: 'username',
    initialState: 'tom',
    reducers: {
        saveUserName(state, action){            
            return action.payload;
        }        
    }
})
export let {saveUserName} = userSlice.actions;

export default configureStore(
    {
        reducer: {
            user: userSlice.reducer            
        }
    }
)