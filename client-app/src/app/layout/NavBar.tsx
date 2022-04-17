import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";

export default function NavBar() {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name="Activities" />
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content="Create Activity" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}

{/*
Now
<Menu.Item>
    <Button as={NavLink} to='/createActivity' positive content="Create Activity" />
</Menu.Item>
NavLink -> comes from ReactRouter

Before
<Menu.Item>
    <Button onClick={() => activityStore.openForm()} positive content="Create Activity" />
</Menu.Item>

*/}