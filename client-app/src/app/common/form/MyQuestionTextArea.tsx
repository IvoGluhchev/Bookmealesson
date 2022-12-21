import { Field, useField } from "formik";
import React from "react";
import { Button, FormField, Form, Label, Segment, Checkbox } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    type?: string
    label?: string;
}

export default function MyQuestionTextArea(props: Props) {
    const [field, meta] = useField(props.name);

    return (
        <Form.Field className="two fields">
            <Form.Field error={meta.touched && !!meta.error} className='twelve wide field'  >
                <label>{props.label}</label>
                <input {...field} {...props} />
                {meta.touched && meta.error ? (
                    <Label basic color='red'>{meta.error}</Label>
                ) : null}

            </Form.Field>
            <Form.Field className='four wide field ui toggle checkbox' >
                <Checkbox label='Маркирай като верен' className='ui toggle checkbox' />
            </Form.Field>
        </Form.Field>

    )
}