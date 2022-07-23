import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { format } from "date-fns";
import { store } from "./store";
import { act } from "react-dom/test-utils";
import { Profile } from "../models/profile";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>(); // this holds all activities in a key/value dic of some sort
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    // Sorting Activities by date
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    // Creating a dic where the date is the key and the value is a list of activities on that date
    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        )
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
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            )
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }

        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);

            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);

            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    // spread operator: this is getting the updated properties from the form and updates only them to the activity
                    let updatedActivity = { ...this.getActivity(activity.id), ...activity };
                    // the compiler is not aware that the updatedActivity is of type Activity
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error);
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

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            // when in an observer this method basically notifies the observer to update or something like that
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    updateAttendance123 = async () => {
        const user = store.userStore.user;
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            // when in an observer this method basically notifies the observer to update or something like that
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
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
// We do not do this if we add makeAutoObservable(this)
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