import React from 'react';
import styled from 'styled-components';
import logo from '../assets/fingerprint.png';
import profile from '../assets/profil.png';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 30px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderLogo = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 6px;
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #111;
`;

const ProfileImage = styled.img`
  width: 65px;
  height: 46px;
`;

const Header = () => (
  <HeaderContainer>
    <HeaderLeft>
      <HeaderLogo src={logo} alt="Logo" />
      <HeaderTitle>Bio Scanner</HeaderTitle>
    </HeaderLeft>
    <ProfileImage src={profile} alt="Profil" />
  </HeaderContainer>
);

export default Header;
