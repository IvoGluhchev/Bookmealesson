import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store{
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore: new ActivityStore()
}

// React context. The CreateContext comes from react
export const StoreContext = createContext(store);

// react hook to allow us use our stores in our componenets
export function useStore(){
    return useContext(StoreContext);
}
