const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const textStatus = document.getElementById('textStatus')
const app = document.getElementById('app')

//Start video
startVideo = () => {
	navigator.getUserMedia(
		{
			video: {},
		},
		(stream) => (video.srcObject = stream),
		(err) => console.log(err)
	)
}

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
	faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
	faceapi.nets.faceExpressionNet.loadFromUri('./models'),
]).then(startVideo)

let statusIcons = {
	default: { emoji: '😐', color: '#008797' },
	neutral: { emoji: '😐', color: '#008797' },
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
		const detections = await faceapi
			.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
			.withFaceExpressions()
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
