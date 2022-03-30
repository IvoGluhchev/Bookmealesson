import React, { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponents from './LoadingComponenets';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
    // We are destructuring the ActivityStore class and setting it w/ the hook we created in store.ts
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]) // we need to pass activityStore as dependency to the react hook useEffect

  if (activityStore.loadingIntial)
    return (
      <LoadingComponents content='Loading app...' />
    )

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

// We are making our App observable by passing it to the higher level function observe
// higher level means that a func accepts as param another func
// our App is actually App function
export default observer(App);
