import { format } from "date-fns";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, List, Popup, Segment, Image, Grid, Loader } from "semantic-ui-react";
import { date } from "yup/lib/locale";
import activityStore from "../../../app/stores/activityStore";
import ActivityFilters from "../../activities/dashboard/ActivityFilters";
import ActivityList from "../../activities/dashboard/ActivityList";
import ActivityListItemAttendee from "../../activities/dashboard/ActivityListItemAttendee";
import ActivityListItemPlaceholder from "../../activities/dashboard/ActivityListItemPlaceholder";
import ProfileCard from "../../profiles/ProfileCard";
import UserFilters from "../dashboard/UserFilters";

export default function ListUsers() {

    const styles = {
        pending: {
            borderColor: 'orange',
            borderWidth: 3
        },
        success: {
            borderColor: 'green',
            borderWidth: 3
        },
        failed: {
            borderColor: 'red',
            borderWidth: 3
        }
    }

    return (
        <>
            <Grid>
                {/*16 column grid system*/}
                <Grid.Column width={10}>
                    {/* <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={false}
                        initialLoad={false}
                    > */}
                        <Segment.Group>
                            <Segment>
                                <Label attached='top' color="teal" content="Active" style={{ textAlign: 'center' }} />
                                <Item.Group>
                                    <Item>
                                        <Item.Image size='tiny' circular src={'/assets/user.png'} style={{ marginBottom: 5 }} />
                                        <Item.Content>
                                            <Item.Header as={Link} to={`/activities/${'activity.id'}`}>
                                                {'User One'}
                                            </Item.Header>
                                            <Item.Description>Hosted by
                                                <Link to={`/profiles/${'activity.hostUsername'}`}> {'activity.host?.displayName'} </Link>
                                            </Item.Description>
                                            <Item.Description>
                                                <Label basic color="orange">
                                                    You are hosting this activity
                                                </Label>
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                            </Segment>
                            <Segment>
                                <span>
                                    <Icon name='clock' /> {format(Date.now(), 'dd MMM yyyy h:mm aa')}
                                    <Icon name='marker' /> {'activity.venue'}
                                </span>
                            </Segment>
                            <Segment secondary>
                                {/* <ActivityListItemAttendee attendees={activity.attendees!} /> */}
                                <List horizontal>
                                    <List.Item key={1} as={Link} to={`/profiles/${'attendee.username'}`}>
                                        <Image
                                            size='mini' rounded src={'/assets/test-color.png'}
                                            bordered
                                            style={styles.pending}
                                        />
                                    </List.Item>
                                    <List.Item key={2} as={Link} to={`/profiles/${'attendee.username'}`}>
                                        <Image
                                            size='mini' rounded src={'/assets/test-color.png'}
                                            bordered
                                            style={styles.success}
                                        />
                                    </List.Item>
                                    <List.Item key={2} as={Link} to={`/profiles/${'attendee.username'}`}>
                                        <Image
                                            size='mini' rounded src={'/assets/test-color.png'}
                                            bordered
                                            style={styles.success}
                                        />
                                    </List.Item>
                                    <List.Item key={2} as={Link} to={`/profiles/${'attendee.username'}`}>
                                        <Image
                                            size='mini' rounded src={'/assets/test-color.png'}
                                            bordered
                                            style={styles.failed}
                                        />
                                    </List.Item>
                                </List>
                            </Segment>
                            {/*clears all the previous floating*/}
                            <Segment clearing>
                                <span>Some Test Description goes here</span>
                                <Button
                                    as={Link}
                                    to={`/activities/${'activity.id'}`}
                                    color='teal'
                                    floated='right'
                                    content='View'
                                />
                            </Segment>
                        </Segment.Group>
                        <Segment.Group>
                            <Segment>
                                <Label attached='top' color="red" content="Cancelled" style={{ textAlign: 'center' }} />
                                <Item.Group>
                                    <Item>
                                        <Item.Image size='tiny' circular src={'/assets/user.png'} style={{ marginBottom: 5 }} />
                                        <Item.Content>
                                            <Item.Header as={Link} to={`/tests/${'test-id'}`}>
                                                {'User Two'}
                                            </Item.Header>
                                            <Item.Description>Hosted by
                                                <Link to={`/profiles/${'activity.hostUsername'}`}> {'activity.host?.displayName'} </Link>
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                            </Segment>
                            <Segment>
                                <span>
                                    <Icon name='clock' /> {format(Date.now(), 'dd MMM yyyy h:mm aa')}
                                    <Icon name='marker' /> {'activity.venue'}
                                </span>
                            </Segment>
                            <Segment secondary>
                                <List horizontal>
                                    <List.Item key={1} as={Link} to={`/profiles/${'attendee.username'}`}>
                                        <Image
                                            size='mini' rounded src={'/assets/test-simple.png'}
                                            bordered
                                            style={styles.success}
                                        />
                                    </List.Item>
                                    <List.Item key={2} as={Link} to={`/profiles/${'attendee.username'}`}>
                                        <Image
                                            size='mini' rounded src={'/assets/test-simple.png'}
                                            bordered
                                            style={styles.pending}
                                        />
                                    </List.Item>
                                </List>
                            </Segment>
                            {/*clears all the previous floating*/}
                            <Segment clearing>
                                <span>{'Some description'}</span>
                                <Button
                                    as={Link}
                                    to={`/activities/${'activity.id'}`}
                                    color='teal'
                                    floated='right'
                                    content='View'
                                />
                            </Segment>
                        </Segment.Group>
                    {/* </InfiniteScroll> */}
                </Grid.Column>
                <Grid.Column width={6}>
                    <UserFilters />
                </Grid.Column>
                <Grid.Column width={10}>
                    <Loader />
                </Grid.Column>
            </Grid>
        </>
    );
}