import { About } from './components/about'
import { BottomBar } from './components/bottom-bar'
import { Capabilities } from './components/capabilities'
import { ChromeField } from './components/chrome-field'
import { Contact } from './components/contact'
import { CustomCursor } from './components/custom-cursor'
import { Footer } from './components/footer'
import { Hero } from './components/hero'
import { MobileMenu } from './components/mobile-menu'
import { Nav } from './components/nav'
import { Work } from './components/work'

export function App() {
  return (
    <>
      <ChromeField />
      <CustomCursor />
      <Nav />
      <MobileMenu />
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
