import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/homepage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';

function App() {
  // useLocation is a hook from react-router-dom
  const location = useLocation();

  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route exact path='/' component={HomePage} />{/*we specify exact because other wise the homepage route will match any route */}
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              {/* The Switch makes each route explicit and only one route could be show at a time. If we remove it the NotFound route will appear everywhere */}
              <Switch>О
                <Route exact path='/activities' component={ActivityDashboard} />{/*blue we have the observer - jsx component able to observe */}
                <Route path='/activities/:id' component={ActivityDetails} /> {/*the yellow are react components and return jsx component*/}
                <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                <Route path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} /> {/*history is not enabled*/}
                <Route path='/not-found' component={NotFound} /> {/*If no mathch is found show this*/}
              </Switch>
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
