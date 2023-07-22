import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import { css } from '@emotion/css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient, STORAGE_KEY, authenticate as authenticateMutation, getChallenge, getDefaultProfile } from '../api'
import { parseJwt, refreshAuthToken } from '../utils'
import { AppContext } from '../context'
import Modal from '../components/CreatePostModal'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react";


function MyApp({ Component, pageProps }) {
  const [connected, setConnected] = useState(true)
  const [userAddress, setUserAddress] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState()
  const router = useRouter();


  const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
  };

  const theme = extendTheme({ config });

  useEffect(() => {
    refreshAuthToken()
    async function checkConnection() {
      const provider = new ethers.providers.Web3Provider(
        (window).ethereum
      )
      const addresses = await provider.listAccounts();
      if (addresses.length) {
        setConnected(true)
        setUserAddress(addresses[0])
        getUserProfile(addresses[0])
      } else {
        setConnected(false)
      }
    }
    checkConnection()
    listenForRouteChangeEvents()
  }, [])

  async function getUserProfile(address) {
    try {
      const urqlClient = await createClient()
      const response = await urqlClient.query(getDefaultProfile, {
        address
      }).toPromise()
      setUserProfile(response.data.defaultProfile)
    } catch (err) {
      console.log('error fetching user profile...: ', err)
    }
  }

  async function listenForRouteChangeEvents() {
    router.events.on('routeChangeStart', () => {
      refreshAuthToken()
    })
  }

  async function signIn() {
    try {
      const accounts = await window.ethereum.send(
        "eth_requestAccounts"
      )
      setConnected(true)
      const account = accounts.result[0]
      setUserAddress(account)
      const urqlClient = await createClient()
      const response = await urqlClient.query(getChallenge, {
        address: account
      }).toPromise()
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const signature = await signer.signMessage(response.data.challenge.text)
      const authData = await urqlClient.mutation(authenticateMutation, {
        address: account, signature
      }).toPromise()
      const { accessToken, refreshToken } = authData.data.authenticate
      const accessTokenData = parseJwt(accessToken)
      getUserProfile(account)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken, refreshToken, exp: accessTokenData.exp
      }))
    } catch (err) {
      console.log('error: ', err)
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <AppContext.Provider value={{
        userAddress,
        profile: userProfile
      }}>
        <div>
          <nav className={navStyle}>
            <div className={navContainerStyle}>
              <div className={linkContainerStyle}>
                <Link href='/'>
                  <p className={logo}>💬 <span>WeaveNFTChat</span></p>
                </Link>
                <Link href='/home'>
                  <p className={linkTextStyle}>Home</p>
                </Link>
                <Link href='/profiles'>
                  <p className={linkTextStyle}>Explore Profiles</p>
                </Link>
                <Link href='/allgroups'>
                  <p className={linkTextStyle}>Explore Communities</p>
                </Link>
                {
                  userProfile && (
                    <Link href={`/profile/${userProfile.id}`}>
                      <p className={linkTextStyle}>Profile</p>
                    </Link>
                  )
                }
              </div>
              <div className={buttonContainerStyle}>
                {
                  !connected && (
                    <button className={buttonStyle} onClick={signIn}>Sign in</button>
                  )
                }
                {
                  connected && (
                    <button
                      className={modalButtonStyle}
                      onClick={() => setIsModalOpen(true)}>
                      Create post
                    </button>
                  )
                }
              </div>
            </div>
          </nav>
          <div className={appLayoutStyle}>
            <Component {...pageProps} />
          </div>
          {
            isModalOpen && (
              <Modal
                setIsModalOpen={setIsModalOpen}
              />
            )
          }
        </div>
      </AppContext.Provider>
    </ChakraProvider>
  )
}

const appLayoutStyle = css`
  margin: 0 auto;
  padding: 78px 100px 100px;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;



const linkTextStyle = css`
  margin-right: 40px;
  font-weight: 600;
  font-size: 15px;
  color: white;
`

const logo = css`
  margin-right: 40px;
  font-weight: 600;
  font-size: 30px;
  color: white;
`

const iconStyle = css`
  height: 50px;
  margin-right: 40px;
`

const modalButtonStyle = css`
  /* Base styles for the button */
  background-color: rgb(249, 92, 255);
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;

  /* Styles for the button text */
  color: black;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;

  /* Hover styles for the button */
  &:hover {
    background-color: #3EF9A5;
  }

  /* Additional styles for the colored button */
  &.coloredButton {

  }
`;

const createPostStyle = css`
  height: 35px;
  margin-right: 5px;
`

const navStyle = css`
  background-color: black;
  padding: 15px 30px;
  display: flex;
  position: fixed;
  width: 100%;
  z-index: 1;
  border-bottom: 1px solid #272929;
`

const navContainerStyle = css`
  width: 900px;
  margin: 0 auto;
  display: flex;
`

const linkContainerStyle = css`
  display: flex;
  align-items: center;
`

const buttonContainerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`

const buttonStyle = css`
  border: none;
  outline: none;
  margin-left: 15px;
  background-color: black;
  color: #340036;
  padding: 13px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: rgb(249, 92, 255);
  transition: all .35s;
  width: 160px;
  letter-spacing: .75px;
  &:hover {
    background-color: rgba(249, 92, 255, .75);
  }
`

export default MyApp
