import React from 'react';
import {Link} from 'react-router-dom';
import MediaQuery from 'react-responsive';

import styled from 'styled-components';

export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.navigation = this.props.navigation
    }

    render(){
        const HeaderContainer = styled.div`
                width:100%;
                padding-top:5em;
                padding-bottom:5em;
                display: inline-flex;
                justify-content: space-between;
                background-color: white;
            `;
        const Titles = styled.div`
                width:15em;
                font-size:25pt;
                font-family: Raleway-Regular;
                color:black;
                letter-spacing: .1em
                text-align:right;
             `;
// -----------------------------------------------------------------
// ------------------ Mobile CSS -----------------------------------
// -----------------------------------------------------------------
        const HeaderContainerMobile = styled.div`
                width:100%;
                padding-top:2em;
                display: flex;
                flex-direction:column;
                justify-content: center;
                align-items:center;
                background-color: white;
            `;
        const TitlesMobile = styled.div`
                width:100%;
                font-size:17pt;
                font-family: Raleway-Regular;
                color:black;
                letter-spacing: .1em
                text-align:center;
             `;
         const StyledLink = styled(Link)`
                text-decoration: none;
                color:silver;
                padding:.6em;
                &:hover{
                    color:white;
                }

         `;
        return(
            <div>
                <MediaQuery query="(min-device-width: 1224px)">
                    <HeaderContainer>
                        <Titles>
                            <div>THE WEATHER APP</div>
                        </Titles>
                    </HeaderContainer>
                </MediaQuery>
                <MediaQuery query="(max-device-width: 1224px)">
                    <HeaderContainerMobile>
                        <TitlesMobile>
                            <div>JAMES MULLER</div>
                        </TitlesMobile>
                    </HeaderContainerMobile>
                </MediaQuery>
            </div>
            )
    }
}
