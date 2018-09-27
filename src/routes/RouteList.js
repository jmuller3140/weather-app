import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import styled from 'styled-components';

import Home from './Home';

import './index.css';

const Wrapper = styled.div`
  height:70%;

  @media (max-device-width: 1224px){
    section.route-section {
        top: 100px;
    }
  }
`;

const RouteList = ({location, match}) => {
              return (
          <Wrapper>
              <section className="route-section">
                <Switch location={location}>
                  <Route exact path="/" component={Home} />
                </Switch>
                </section>
          </Wrapper>
                )
};

export default withRouter(RouteList)