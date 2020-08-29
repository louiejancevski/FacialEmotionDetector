const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const textStatus = document.getElementById('textStatus')
const app = document.getElementById('app')

//Start video
startVideo = () => {
	// Older browsers might not implement mediaDevices at all, so we set an empty object first
	if (navigator.mediaDevices === undefined) {
		navigator.mediaDevices = {}
	}

	// Some browsers partially implement mediaDevices. We can't just assign an object
	// with getUserMedia as it would overwrite existing properties.
	// Here, we will just add the getUserMedia property if it's missing.
	if (navigator.mediaDevices.getUserMedia === undefined) {
		navigator.mediaDevices.getUserMedia = function (constraints) {
			// First get ahold of the legacy getUserMedia, if present
			var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia

			// Some browsers just don't implement it - return a rejected promise with an error
			// to keep a consistent interface
			if (!getUserMedia) {
				return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
			}

			// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
			return new Promise(function (resolve, reject) {
				getUserMedia.call(navigator, constraints, resolve, reject)
			})
		}
	}

	navigator.mediaDevices
		.getUserMedia({ video: true })
		.then(function (stream) {
			// Older browsers may not have srcObject
			if ('srcObject' in video) {
				video.srcObject = stream
			} else {
				// Avoid using this in new browsers, as it is going away.
				video.src = window.URL.createObjectURL(stream)
			}
			video.onloadedmetadata = function (e) {
				video.play()
			}
		})
		.catch(function (err) {
			console.log(err.name + ': ' + err.message)
		})
}

Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('./models'), faceapi.nets.faceLandmark68Net.loadFromUri('./models'), faceapi.nets.faceRecognitionNet.loadFromUri('./models'), faceapi.nets.faceExpressionNet.loadFromUri('./models')]).then(startVideo)

let statusIcons = {
	default: { emoji: '😐', color: '#02c19c' },
	neutral: { emoji: '😐', color: '#54adad' },
	happy: { emoji: '😀', color: '#148f77' },
	sad: { emoji: '😥', color: '#767e7e' },
	angry: { emoji: '😠', color: '#b64518' },
	fearful: { emoji: '😨', color: '#90931d' },
	disgusted: { emoji: '🤢', color: '#1a8d1a' },
	surprised: { emoji: '😲', color: '#1230ce' },
}

video.addEventListener('play', () => {
	//Get dimensions from the actual video source
	const displaySize = { width: video.width, height: video.height }

	//Match those dimensions
	faceapi.matchDimensions(canvas, displaySize)

	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
		const resizedDetections = faceapi.resizeResults(detections, displaySize)
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		faceapi.draw.drawDetections(canvas, resizedDetections)
		faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

		if (detections.length > 0) {
			//For each face detection
			detections.forEach((element) => {
				let status = ''
				let valueStatus = 0.0
				for (const [key, value] of Object.entries(element.expressions)) {
					if (value > valueStatus) {
						status = key
						valueStatus = value
					}
				}
				//Once we have the highest scored expression (status)
				emoji.innerHTML = statusIcons[status].emoji

				//Set the right emoji
				textStatus.innerHTML = status

				//Change background color
				app.style.backgroundColor = statusIcons[status].color
			})
		} else {
			//If not face was detected

			//Set default emoji
			emoji.innerHTML = statusIcons['default'].emoji

			//Change text
			textStatus.innerHTML = '...'

			//Change background color to default
			app.style.backgroundColor = statusIcons['default'].color
		}
	}, 100)
})
