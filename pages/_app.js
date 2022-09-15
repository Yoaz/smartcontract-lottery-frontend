import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider
            initializeOnMount={false}
            serverUrl="https://1gblygxewezk.usemoralis.com:2053/server"
            appId="JI9Aowcpe9MYzTrrxgFIKoNFFbl41WyAq2Pty4Pf"
        >
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
