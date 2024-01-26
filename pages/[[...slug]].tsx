// import NextIndexWrapper from '../src'

// next/dynamic is used to prevent breaking incompatibilities 
// with SSR from window.SOME_VAR usage, if this is not used
// next/dynamic can be removed to take advantage of SSR/prerendering
import dynamic from 'next/dynamic'

// try changing "ssr" to true below to test for incompatibilities, if
// no errors occur the above static import can be used instead and the
// below removed
const NextIndexWrapper = dynamic(() => import('../src'), { ssr: false })

export default function Page(props) {
  return <NextIndexWrapper {...props} />
}
