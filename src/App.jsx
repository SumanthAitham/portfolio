import React from 'react'
import Navbar from "#components/navbar.jsx";
import Welcome from "#components/welcome.jsx";
import Dock from "#components/Dock.jsx";
import gsap from 'gsap';

import { Draggable } from 'gsap/Draggable';
import Terminal from '#windows/Terminal';
gsap.registerPlugin(Draggable);

const App = () => {
    return (
        <main>
            <Navbar />
            <Welcome />
            <Dock />
            <Terminal />
        </main>

    )
}
export default App
