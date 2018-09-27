import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import styled from 'styled-components';

import Home from './Home';

import './index.css';

const Wrapper = styled.div`
  height:70%;

  .fade-enter {
      opacity: 0.01;
  }

  .fade-enter.fade-enter-active {
      opacity: 1;
      transition: opacity 500ms ease-in;
  }

  .fade-exit {
      opacity: 1;
  }

  .fade-exit.fade-exit-active {
      opacity: 0.01;
      transition: opacity 500ms ease-in;
  }
  div.transition-group {
           position: relative;
      }
  section.route-section {
        position: relative;
        width: 100%;
        height:100%;
        top: 0;
        left: 0;
      }
  @media (max-device-width: 1224px){
    section.route-section {
        top: 125px;
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
