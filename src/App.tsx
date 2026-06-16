import { About } from './components/about'
import { BottomBar } from './components/bottom-bar'
import { Capabilities } from './components/capabilities'
import { Contact } from './components/contact'
import { CustomCursor } from './components/custom-cursor'
import { Footer } from './components/footer'
import { Hero } from './components/hero'
import { Nav } from './components/nav'
import { Work } from './components/work'

export function App() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Capabilities />
        <Contact />
      </main>
      <BottomBar />
      <Footer />
    </>
  )
}
