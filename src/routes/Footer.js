import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faFacebook, faTwitterSquare, faGithub } from '@fortawesome/free-brands-svg-icons';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';

const Footer = () => {

    const FooterContainer = styled.div`
        width:100%;
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
            color:white;
        }
    `;
    const Copyright = styled.div`
        color:grey;
        font-family:Moon-Light;
    `;
//
// ---------------------
//
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
            color:white;
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
                    <Icons>
                        <Icon href="https://www.facebook.com/jimmy.muller.7140" target="_blank"><FontAwesomeIcon icon={faFacebook}/></Icon>
                        <Icon href="https://twitter.com/jmuller3140" target="_blank"><FontAwesomeIcon icon={faTwitterSquare}/></Icon>
                        <Icon href="http://www.linkedin.com/in/james-muller3140" target="_blank"><FontAwesomeIcon icon={faLinkedin}/></Icon>
                        <Icon href="https://github.com/jmuller3140" target="_blank"><FontAwesomeIcon icon={faGithub}/></Icon>
                    </Icons>
                    <Copyright>
                        Made in 2018 <FontAwesomeIcon icon={faCopyright}/>
                    </Copyright>
                </FooterContainer>
            </MediaQuery>
            <MediaQuery query="(max-device-width: 1224px)">
                <FooterContainerMobile >
                    <IconsMobile>
                        <IconMobile href="https://www.facebook.com/jimmy.muller.7140" target="_blank"><FontAwesomeIcon icon={faFacebook}/></IconMobile>
                        <IconMobile href="https://twitter.com/jmuller3140" target="_blank"><FontAwesomeIcon icon={faTwitterSquare}/></IconMobile>
                        <IconMobile href="http://www.linkedin.com/in/james-muller3140" target="_blank"><FontAwesomeIcon icon={faLinkedin}/></IconMobile>
                        <IconMobile href="https://github.com/jmuller3140" target="_blank"><FontAwesomeIcon icon={faGithub}/></IconMobile>
                    </IconsMobile>
                    <CopyrightMobile>
                        Made in 2018 <FontAwesomeIcon icon={faCopyright}/>
                    </CopyrightMobile>
                </FooterContainerMobile>
            </MediaQuery>
        </div>
            )
    }
export default Footer
