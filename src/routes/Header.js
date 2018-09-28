import React from 'react';
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
                padding-top:4%;
                padding-bottom:4%;
                display: inline-flex;
                justify-content: space-between;
                background-color: white;
                z-index:400;
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
        return(
            <div style={{zIndex: '1000'}}>
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
                            <div>THE WEATHER APP</div>
                        </TitlesMobile>
                    </HeaderContainerMobile>
                </MediaQuery>
            </div>
            )
    }
}
