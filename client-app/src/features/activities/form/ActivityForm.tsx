import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponenet";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";

// CreateActivity
// activity: selectedActivity -> giving this param an input name
export default observer(function ActivityForm() {
    const history = useHistory();
    const { activityStore } = useStore();
    const { createActivity, updateActivity,
        loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    // By adding dependencies [id, loadActivity] to the useEffect we are saying execute the code insde only if these've changed
    useEffect(() => {
        // setActivity(activity!) with ! we say that we are certain as devs this will not be undefined
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity]);

    function handleSubmit() {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        /**event.target has 2 properties name & value and we are assigning them to the destructed const  */
        const { name, value } = event.target;
        /**...activity means we spread the object and can assign values to differnt properties
           2nd part -> find prop with [name] and assign to it the value */
        setActivity({ ...activity, [name]: value })
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing> {/*clearing remoevs all prevous floating and the buttons are positioned ok*/}
            <Form onSubmit={() => handleSubmit()} autoComplete="off">
                <Form.Input placeholder="Title" value={activity.title} name="title" onChange={handleInputChange} />
                <Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={handleInputChange} />
                <Form.Input placeholder="Category" value={activity.category} name="category" onChange={handleInputChange} />
                <Form.Input type="date" placeholder="Date" value={activity.date} name="date" onChange={handleInputChange} />
                <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputChange} />
                <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChange} />
                <Button loading={loading} floated="right" positive type="submit" content="Submit" />
                <Button as={Link} to='/activities' floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
})