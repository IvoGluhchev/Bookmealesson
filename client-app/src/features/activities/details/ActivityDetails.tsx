import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponents from "../../../app/layout/LoadingComponenets";
import { useStore } from "../../../app/stores/store";


export default function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity } = activityStore;

  if (!selectedActivity) return <LoadingComponents />;

  return (
    <Card fluid>
      {/*
            by using `...` this gives you the chance to put properties directly into the string
            like this ${_property_}
        */}
      <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{selectedActivity.title}</Card.Header>
        <Card.Meta>
          <span>{selectedActivity.date}</span>
        </Card.Meta>
        <Card.Description>
          {selectedActivity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group width="2">
          <Button onClick={() => activityStore.openForm(selectedActivity.id)} basic color="blue" content="Edit" />
          <Button onClick={() => activityStore.cancelSelectedActivity()} basic color="grey" content="Cancel" />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}
/**
 * <Button onClick={cancelSelectActivity}... would not be imidiately
 * executed because for the function cancelSelectActivity we are not using () -> cancelSelectActivity()
 * onClick={() => cancelSelectActivity()} or onClick={cancelSelectActivity}
 * onClick={() => cancelSelectActivity} does not work without the parenthesis at the end
 */