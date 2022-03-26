import React1, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, List, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

// That is destructured props -> { activities, selectActivity, deleteActivity, submitting }: Props
export default function ActivityList({ activities, selectActivity, deleteActivity, submitting }: Props) {
    const [target, setTarget] = useState('');

    // 'e' is the click event which derives from SyntheticEvent and is of type HTMLButtonElement
    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        // The event has a current target which is the clicked button and we are getting it's name
        // which is the activity id
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta> {activity.date} </Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                {/**We wrap onClick in arrow func to not get executed imidiately
                                 * waits until we click the button before doing anything
                                */}
                                <Button onClick={() => selectActivity(activity.id)} floated="right" content="View" color="blue" />
                                <Button
                                    name={activity.id}
                                    onClick={(e) => handleActivityDelete(e, activity.id)}
                                    // we do this in order not all delete buttons to show the loading sign
                                    // if submitting is true & the clicked button is the one with activity.id
                                    loading={submitting && target === activity.id}
                                    floated="right" content="Delete" color="red" />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}