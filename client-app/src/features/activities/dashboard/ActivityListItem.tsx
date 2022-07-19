import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
    activity: Activity
}

export default function ActivityListItem({ activity }: Props) {

    return (
        <Segment.Group>
            <Segment>
                {activity.isCancelled
                    && <Label attached='top' color="red" content="Cancelled" style={{ textAlign: 'center' }} />
                }
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={activity.host?.image || '/assets/user.png'} style={{ marginBottom: 5 }} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by
                                <Link to={`/profiles/${activity.hostUsername}`}> {activity.host?.displayName} </Link>
                            </Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label circular color="green">
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
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