import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activity: Activity
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
}

export default function ActivityDetails({ activity, cancelSelectActivity, openForm }: Props) {
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
              <Button onClick={() => openForm(activity.id)} basic color="blue" content="Edit"/>
              <Button onClick={() => cancelSelectActivity()} basic color="grey" content="Cancel"/>
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