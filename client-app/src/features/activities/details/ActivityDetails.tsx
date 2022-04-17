import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponenet";
import { useStore } from "../../../app/stores/store";


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
    <Card fluid>
      {/*
            by using `...` this gives you the chance to put properties directly into the string
            like this ${_property_}
        */}
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group width="2">
          <Button as={Link} to={`/manage/${activity.id}`} floated="left"  basic color="blue" content="Edit" />
          <Button as={Link} to={"/activities"} floated="left" basic color="grey" content="Cancel" />
        </Button.Group>
      </Card.Content>
    </Card>
  )
})


/**
 * <Button onClick={cancelSelectActivity}... would not be imidiately
 * executed because for the function cancelSelectActivity we are not using () -> cancelSelectActivity()
 * onClick={() => cancelSelectActivity()} or onClick={cancelSelectActivity}
 * onClick={() => cancelSelectActivity} does not work without the parenthesis at the end
 */