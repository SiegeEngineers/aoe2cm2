import '../src/sass/bulma.scss'
import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps}) {
  return (
    <>
      <Head>
        <title>AoE Captains Mode</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      
      <Component {...pageProps} />
    </>
  )
}
