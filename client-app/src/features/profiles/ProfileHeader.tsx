import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic, StatisticGroup } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";

interface Props {
    profile: Profile;
}

// Although we are not accesing a store directly here we still need to make this component an observer
// otherwise we will not react to any changes of the profile
export default observer(function ProfileHeader({ profile }: Props) {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profile.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profile.displayName} />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label="Followers" value="5" />
                        <Statistic label="Following" value="42" />
                    </Statistic.Group>
                    <Divider />
                    <Reveal animated="move">
                        <Reveal.Content visible style={{ width: "100%" }}>
                            <Button fluid color="teal" content="Following" />
                        </Reveal.Content>
                        <Reveal.Content hidden style={{ width: "100%" }}>
                            <Button
                                fluid
                                basic
                                color={true ? "red" : "teal"}
                                content={true ? "Unfollow" : "Follow"} />
                        </Reveal.Content>
                    </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    );
})