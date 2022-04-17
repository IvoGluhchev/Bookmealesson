import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}

// import { makeAutoObservable, runInAction } from "mobx";
// import agent from "../api/agent";
// import { Activity } from "../models/activity";
// import { v4 as uuid } from "uuid";

// export default class ActivityStore {
//     selectedActivity: Activity | undefined = undefined;
//     editMode = false;
//     loading = false;
//     loadingInitial = true;
//     activityRegistry = new Map<string, Activity>();

//     constructor() {
//         makeAutoObservable(this)
//     }

//     // computed property
//     get activitiesByDate() {
//         return Array.from(this.activityRegistry.values())
//             .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
//     }

//     // async is syntactic sugar over promisses
//     loadActivities = async () => {
//         try {
//             this.loadingInitial = true;
//             // this is coming from our API the list is agent that actually is a client
//             const activitiesApi = await agent.Activities.list();
//             activitiesApi.forEach(activity => {
//                 this.setActivity(activity);
//             });
//             this.setLoadingInital(false);
//         } catch (error) {
//             console.log(error);
//             this.setLoadingInital(false);
//         }
//     }

//     loadActivity = async (id: string) => {
//         let activity = this.getActivity(id);
//         if (activity) {
//             this.selectedActivity = activity;
//             return activity;
//         } else {
//             this.loadingInitial = true;
//             try {
//                 activity = await agent.Activities.details(id);
//                 this.setActivity(activity);
//                 // We runInAction this code because mobx is in strict mode
//                 runInAction(() => {
//                     this.selectedActivity = activity;
//                 });
//                 this.setLoadingInital(false);
//                 return activity;
//             } catch (error) {
//                 console.log(error);
//                 this.setLoadingInital(false);
//             }
//         }
//     }

//     private getActivity = (id: string) => {
//         return this.activityRegistry.get(id);
//     }

//     private setActivity = (activity: Activity): void => {
//         // takes the first part of the split array
//         activity.date = activity.date.split('T')[0];
//         // this is our local dic of activities -> we are mutating state
//         this.activityRegistry.set(activity.id, activity);
//     }

//     // this is an action
//     setLoadingInital = (state: boolean) => {
//         this.loadingInitial = state;
//     }

//     createActivity = async (activity: Activity) => {
//         this.loading = true;
//         activity.id = uuid();
//         try {
//             await agent.Activities.create(activity);
//             runInAction(() => {
//                 this.activityRegistry.set(activity.id, activity);
//                 this.selectedActivity = activity;
//                 this.editMode = false;
//                 this.loading = false;
//             })
//         } catch (error) {
//             console.log(error);
//             runInAction(() => {
//                 this.loading = false;
//             })
//         }
//     }

//     updateActivity = async (activity: Activity) => {
//         this.loading = true;
//         try {
//             await agent.Activities.update(activity);
//             runInAction(() => {
//                 // create new array from activity and push the edited into the array
//                 this.activityRegistry.set(activity.id, activity);
//                 this.selectedActivity = activity;
//                 this.editMode = false;
//                 this.loading = false;
//             })
//         } catch (error) {
//             console.log(error);
//             runInAction(() => {
//                 this.loading = false;
//             })
//         }
//     }

//     deleteActivity = async (id: string) => {
//         this.loading = true;
//         try {
//             await agent.Activities.delete(id);
//             runInAction(() => {
//                 this.activityRegistry.delete(id);
//                 this.loading = false;
//             })
//         } catch (error) {
//             console.log(error);
//             runInAction(() => {
//                 this.loading = false;
//             })
//         }
//     }
// }

// Above is the simpler way to create a store and bind the observable (title) and action (setTitle) to it
//
//import { action, makeAutoObservable, makeObservable, observable } from "mobx";
//
// We do not this if we add makeAutoObservable(this)
    // constructor(){
    //     makeObservable(this, {
    //         title: observable,
    //         setTitle: action
    //     })
    // }


    // using it as an arrow function automatically binds the function (setTitle) to the class (ActivityStore)
    // setTitle = () => {
    //     this.title = this.title + '!';
    // }
    // because we use the this leyword we need to bind this property to the class
    // and in makeObservable we have to add -> setTitle: action.bound
    // setTitle(){
    //     this.title = this.title + '!';
    // }
//}