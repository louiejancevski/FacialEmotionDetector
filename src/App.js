import React from 'react'
import './App.css'

function App() {
	return (
		<>
			<div id="app" className="app">
				<div class="overlay"></div>
				<div className="text">
					<span aria-label="emoji" role="img" id="emoji">
						😐
					</span>
					You look <span id="textStatus">...</span>!
				</div>
				<div className="mockup">
					<div id="browser " className="browser">
						<div className="browserChrome">
							<div className="browserActions"></div>
						</div>
						<canvas id="canvas"> </canvas>
						<video id="video" width="540" height="405" muted autoPlay></video>
					</div>
				</div>
				<p className="note">You are not being recorded, it all happens in your own browser!</p>
			</div>
		</>
	)
}

export default App
