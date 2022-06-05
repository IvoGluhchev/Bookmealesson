import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";

interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore()
}

// React context. The CreateContext comes from react
export const StoreContext = createContext(store);

// react hook to allow us use our stores in our componenets
export function useStore() {
    return useContext(StoreContext);
}
