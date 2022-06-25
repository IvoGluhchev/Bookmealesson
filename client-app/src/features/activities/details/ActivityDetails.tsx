import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Grid, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponenet";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";


export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity: activity, loadActivity, loadingInitial: loadingIntial } = activityStore;
  // We need to tell useParams about the properties of the params
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) loadActivity(id);
    // loading the dependencies -> id and loadActivity
  }, [id, loadActivity])

  if (loadingIntial || !activity) return <LoadingComponent />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={activity} />
      </Grid.Column>
    </Grid>
  )
})

/** the bang operator '!' at the end of activity.attendees! tells the compiler 'there is no chance this to be undefined'*/

/**
 * <Button onClick={cancelSelectActivity}... would not be imidiately
 * executed because for the function cancelSelectActivity we are not using () -> cancelSelectActivity()
 * onClick={() => cancelSelectActivity()} or onClick={cancelSelectActivity}
 * onClick={() => cancelSelectActivity} does not work without the parenthesis at the end
 */