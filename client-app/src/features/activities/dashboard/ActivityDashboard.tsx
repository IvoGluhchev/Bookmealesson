import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponenet";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";

// we need the observer in order to display (observe) the changes from edit and view
export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, } = activityStore;

    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
        // we need to pass activityStore as dependency to the react hook useEffect
    }, [activityRegistry, loadActivities])

    if (activityStore.loadingInitial) return (<LoadingComponent content='Loading app...' />)

    return (
        <Grid>
            {/*16 column grid system*/}
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})

  // This code shows the activity detials to the right of the ActivityList
 // We are destructuring the ActivityStore class and setting it w/ the hook we created in store.ts
 // const { selectedActivity, editMode } = activityStore;
 // return (
    //     <Grid>
    //          {/*16 column grid system*/}
    //         <Grid.Column width={10}>
    //             <ActivityList />
    //         </Grid.Column>
    //         <Grid.Column width={6}>
    //             {/** anything to the right of && can execute as long as the left part is not null or undefined
    //             and they have to be wrapped in {} */}
    //             {selectedActivity && !editMode &&
    //                 <ActivityDetails />}
    //             {editMode &&
    //                 <ActivityForm />}
    //         </Grid.Column>
    //     </Grid>
    // )
