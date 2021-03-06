import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="keywords"
					content="LUDO, LUDO Online, Free LUDO, Free LUDO Game, Free LUDO Game Online"
				/>
				<meta
					name="description"
					content="A LUDO Game which you can play in your browser"
				/>
			</Head>
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
