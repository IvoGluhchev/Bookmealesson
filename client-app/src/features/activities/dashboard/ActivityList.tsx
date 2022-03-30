import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

// That is destructured props -> { activities, selectActivity, deleteActivity, submitting }: Props
export default observer (function ActivityList() {
    const {activityStore} = useStore();
    const {deleteActivity, selectActivity, activitiesByDate, loading } = activityStore;
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
                {activitiesByDate.map(activity => (
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
                                    loading={loading && target === activity.id}
                                    floated="right" content="Delete" color="red" />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})