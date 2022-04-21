import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";

interface Props {
    activity: Activity
}

export default function ActivityListItem({ activity }: Props) {

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by Bob(hardcoded)</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {activity.date}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                Atendees go here
            </Segment>
            {/*clears all the previous floating*/}
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    );
}


// const { activityStore } = useStore();
// const { deleteActivity, loading } = activityStore;

// const [target, setTarget] = useState('');

// // 'e' is the click event which derives from SyntheticEvent and is of type HTMLButtonElement
// function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
//     // The event has a current target which is the clicked button and we are getting it's name
//     // which is the activity id
//     setTarget(e.currentTarget.name);
//     deleteActivity(id);
// }