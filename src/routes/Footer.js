import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faFacebook, faTwitterSquare, faGithub } from '@fortawesome/free-brands-svg-icons';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';

const Footer = () => {

    const FooterContainer = styled.div`
        position:relative;
        width:100%;
        margin-top:13em;
        padding-bottom:5em;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
    `;
    const Icons = styled.div`
        width:100%;
        display:flex;
        flex-direction:row;
        justify-content:center;
    `;
    const Icon = styled.a`
        color:grey;
        font-size:35pt;
        padding:1em;
        border-top:1px solid silver;

        &:hover{
            color:black;
        }
    `;
    const Copyright = styled.div`
        color:grey;
        font-family:Moon-Light;
    `;
//////////////////////////////
// Mobile functionality //////
/////////////////////////////
    const FooterContainerMobile = styled.div`
        width:100%;
        padding-bottom:5em;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
    `;
    const IconsMobile = styled.div`
        width:100%;
        display:flex;
        flex-direction:row;
        justify-content:center;
    `;
    const IconMobile = styled.a`
        color:grey;
        font-size:20pt;
        padding:1em;
        border-top:1px solid silver;

        &:hover{
            color:black;
        }
    `;
    const CopyrightMobile = styled.div`
        color:grey;
        font-family:Moon-Light;
    `;

        return(
        <div>
            <MediaQuery query="(min-device-width: 1224px)">
                <FooterContainer>
                    <Copyright>
                        Made by James Muller
                    </Copyright><br/>
                    <Copyright>
                        Made in 2018 <FontAwesomeIcon icon={faCopyright}/>
                    </Copyright>
                </FooterContainer>
            </MediaQuery>
            <MediaQuery query="(max-device-width: 1224px)">
                <FooterContainerMobile>
                    <CopyrightMobile>
                        Made by James Muller
                    </CopyrightMobile>
                    <CopyrightMobile>
                        Made in 2018 <FontAwesomeIcon icon={faCopyright}/>
                    </CopyrightMobile>
                </FooterContainerMobile>
            </MediaQuery>
        </div>
            )
    }
export default Footer
