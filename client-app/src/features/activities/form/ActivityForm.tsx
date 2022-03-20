import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
}

/** activity: selectedActivity -> giving this param an input name */
export default function ActivityForm({ activity: selectedActivity, closeForm, createOrEdit }: Props) {
    /** ?? anything to the right if the left part is null as in c# */
    const initialState = selectedActivity ??
    {
        id: "",
        title: "",
        date: "",
        description: "",
        category: "",
        city: "",
        venue: "",
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        createOrEdit(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        /**event.target has 2 properties name & value and we are assigning them to the destructed const  */
        const { name, value } = event.target;
        /**...activity means we spread the object and can assign values to differnt properties
         * 2nd part -> find prop with [name] and assign to it the value
         */
        setActivity({ ...activity, [name]: value })
    }

    return (
        <Segment clearing> {/*clearing remoevs all prevous floating and the buttons are positioned ok*/}
            <Form onSubmit={() => handleSubmit()} autoComplete="off">
                <Form.Input
                    placeholder="Title" value={activity.title} name="title" onChange={handleInputChange}/>
                <Form.TextArea
                    placeholder="Description" value={activity.description} name="description" onChange={handleInputChange}/>
                <Form.Input
                    placeholder="Category" value={activity.category} name="category" onChange={handleInputChange} />
                <Form.Input
                    placeholder="Date" value={activity.date} name="date" onChange={handleInputChange} />
                <Form.Input
                    placeholder="City" value={activity.city} name="city" onChange={handleInputChange} />
                <Form.Input
                    placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChange} />
                <Button floated="right" positive type="submit" content="Submit" />
                <Button onClick={() => closeForm()} floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
}