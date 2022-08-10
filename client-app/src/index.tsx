

import React from 'react';
import ReactDOM from 'react-dom';
import 'react-calendar/dist/Calendar.css'
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './app/layout/styles.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/stores/store';
import { BrowserRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import ScrollToTop from './app/layout/ScrollToTop';

export const history = createMemoryHistory();
ReactDOM.render(
  <StoreContext.Provider value={store}>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StoreContext.Provider>,
  document.getElementById('root')
);

reportWebVitals();
