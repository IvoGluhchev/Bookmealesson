import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Divider, Header, Segment } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { Formik, Form } from "formik";
import * as Yup from 'yup'
import { useStore } from "../../app/stores/store";
import { ActivityFormValues } from "../../app/models/activity";
import LoadingComponent from "../../app/layout/LoadingComponenet";
import MyTextInput from "../../app/common/form/MyTextInput";
import MySelectInput from "../../app/common/form/MySelectInput";
import MyDateInput from "../../app/common/form/MyDateInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { testCategoryOptions, testMethodOptions, testTypeOptions } from "../../app/common/options/testCategoryOptions";
import MyQuestionTextArea from "../../app/common/form/MyQuestionTextArea";

export default function CreateTest() {

    const history = useHistory();
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());
    const questionList: React.ReactElement[]  = [];
    let uKey = 1;

    // By adding dependencies [id, loadActivity] to the useEffect we are saying execute the code insde only if these've changed
    useEffect(() => {
        // setActivity(activity!) with ! we say that we are certain as devs this will not be undefined
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    }, [id, loadActivity]);

    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    function onAddQuestion(){
        const test = <MyQuestionTextArea placeholder='Отговор' name='venue' key={++uKey}/>;
        questionList.push(test);
        console.log(questionList);
    }

    return (
        <Segment clearing>
            <Header content='Test Details' sub color='teal' />
            <Formik
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => {
                    return (
                        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                            <MyTextInput name='title' placeholder='Title' />
                            <MySelectInput options={testMethodOptions} placeholder='Методика' name='method' />
                            <MySelectInput options={testTypeOptions} placeholder='Тип' name='type' />
                            <MySelectInput options={testCategoryOptions} placeholder='Категория' name='category' />
                            <MyTextArea rows={3} placeholder='Описание' name='description' />

                            <MyTextArea rows={3} placeholder='Инструкции' name='instructions' />
                            <MyDateInput
                                placeholderText='Date'
                                name='date'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm aa' />
                            <Header content='Test Content' sub color='teal' />
                            <MyTextInput placeholder='Въпрос' name='city' />

                            <MyQuestionTextArea placeholder='Отговор' name='venue' />
                            {/* <Button floated='right' onClick={onAddQuestion} content='Добави отговор' />
                            <Divider /> */}
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={isSubmitting} floated='right'
                                positive type='submit' content='Submit' />
                            <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                        </Form>
                    );
                }}
            </Formik>
        </Segment>
    )
}