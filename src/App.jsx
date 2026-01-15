import React from 'react'
import Navbar from "#components/navbar.jsx";
import Welcome from "#components/welcome.jsx";
import Dock from "#components/Dock.jsx";

const App = () => {
    return (
        <main>
            <Navbar />
            <Welcome />
            <Dock />
        </main>

    )
}
export default App
