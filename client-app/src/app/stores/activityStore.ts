import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";

export default class ActivityStore {
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingIntial = true;
    activityRegistry = new Map<string, Activity>();

    constructor() {
        makeAutoObservable(this)
    }

    // computed property
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    // async is syntactic sugar over promisses
    loadActivities = async () => {
        try {
            const activitiesApi = await agent.Activities.list(); // this is coming from our API the list is agent that actually is a client
            activitiesApi.forEach(activity => {
                activity.date = activity.date.split('T')[0]; // takes the first part of the split array
                this.activityRegistry.set(activity.id, activity); // this is our local dic of activities -> we are mutating state
            });
            this.setLoadingInital(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInital(false);
        }
    }

    // this is an action
    setLoadingInital = (state: boolean) => {
        this.loadingIntial = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
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
                // create new array from activity and push the edited into the array
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
                if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
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