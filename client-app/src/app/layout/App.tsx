import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/homepage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {
  // useLocation is a hook from react-router-dom
  const location = useLocation();

  return (
    <Fragment>
      <Route exact path='/' component={HomePage} />{/*we specify exact because other wise the homepage route will match any route */}
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Route exact path='/activities' component={ActivityDashboard} />{/*blue we have the observer - jsx component able to observe */}
              <Route path='/activities/:id' component={ActivityDetails} /> {/*the yellow are react components and return jsx component*/}
              <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
            </Container>
          </>
        )}
      />
    </Fragment>
  );
}
// activities/:id the :id will act as a placeholder for the actual activity id wehn we navigate to this route

// We are making our App observable by passing it to the higher level function observe
// higher level means that a func accepts as param another func
//<Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
// our App is actually App function
export default observer(App);
