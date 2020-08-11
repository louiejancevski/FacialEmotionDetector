import React from 'react'
import './App.css'
import About from './About'

function App() {
	return (
		<>
			<div id="app" className="app">
				<p className="note">
					You are not being recorded, it all happens in your own browser!
				</p>

				<div className="mockup">
					<div id="browser " className="browser">
						<div className="browserChrome">
							<div className="browserActions"></div>
						</div>
						<canvas id="canvas"></canvas>
						<video id="video" width="540" height="405" muted autoPlay></video>
					</div>
				</div>

				<div class="text">
					<div id="emoji">😐</div>
					You look <span id="textStatus">...</span>!
				</div>
			</div>
		</>
	)
}

export default App
