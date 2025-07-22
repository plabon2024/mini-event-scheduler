import Events from "../components/Events";
import Footer from "../components/Footer";
import Header from "../components/Header";
export default function Home() {

  return (
  <div className="container mx-auto min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Events />
      </main>
      <Footer />
    </div>
  )
}
