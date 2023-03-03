import react from 'react'
import { Link } from 'react-router-dom';
import { Container, Icon, Segment } from 'semantic-ui-react';
import { Button, Grid, Header, Image } from "semantic-ui-react";

const style = {
    h1: {
        marginTop: '3em',
    },
    h2: {
        margin: '4em 0em 2em',
    },
    h3: {
        marginTop: '2em',
        padding: '2em 0em',
    },
    last: {
        marginBottom: '300px',
    },
}

export default function MainTestPage() {

    return (
        <>
            <Header as='h2' content='Responsive Grid with Variations' style={style.h2} textAlign='center' />
            <Header as='h3' content='Stackable Divided Grid' style={style.h3} textAlign='center' />
            <Grid columns={2} container divided stackable>
                <Grid.Row>
                    <Grid.Column>
                        <Button as={Link} to='/createTest' fluid color='teal'>Създай Тест</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button as={Link} to='/assignTest' fluid color='teal'>Назначи Тест</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button as={Link} to='/createUser' fluid color='teal'>Създай Потребител</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button as={Link} to='/listUsers' fluid color='teal'>Потребители</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button as={Link} to='/sampleTest' fluid color='teal'>Примерен Тест</Button>
                    </Grid.Column>
                    <Grid.Column>
                        <Button fluid color='teal'>Методики</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </>
    )
}