import { observer } from "mobx-react-lite";
import React from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

// we need the observer in order to display (observe) the changes from edit and view
export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { selectedActivity, editMode } = activityStore;

    return (
        <Grid>
            <Grid.Column width={10}> {/*16 column grid system*/}
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                {/** anything to the right of && can execute as long as the left part is not null or undefined
                and they have to be wrapped in {} */}
                {selectedActivity && !editMode &&
                    <ActivityDetails />}
                {editMode &&
                    <ActivityForm />}
            </Grid.Column>
        </Grid>
    )
})