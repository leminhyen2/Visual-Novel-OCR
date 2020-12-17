Want to help out? 
Need tech-support?
Join our discord at https://discord.com/invite/XFbWSjMHJh

Demo Video:
https://www.youtube.com/watch?v=AdLwcU03230

### Requirements: 
- User Interface:
  - ElectronJS 
- Backend Server:
  - Python3
  - Nodejs 
  - Tesseract-OCR 5

### Installation:
- Flask server:
  - opencv-python
  - numpy
  - flask
  - flask-cors
  - mss 
  - python-dotenv

- NodeJS server:
  - "npm install"

- Tesseract-OCR 5:
  - Download from https://digi.bib.uni-mannheim.de/tesseract/?C=M;O=A
  - Download best pre-trained models from https://github.com/tesseract-ocr/tessdata_best
  - For Japanese language, choose https://github.com/tesseract-ocr/tessdata_best/blob/master/jpn.traineddata
  - Drag jpn.traineddata to Tesseract-OCR/tessdata
  - Go to backendServer/node-tesseract-ocr.js and update Tesseract-OCR's directory
  - For Window environment, I would the whole folder inside backendServer/

### Activation: 
- ElectronJS (npm start)
- Flask server (python3 -m flask run)
- NodeJS server (node server.js)

Note: Window developers can click on Visual Novel OCR.bat to open all three commands at the same time

### Build: 
- User Interface:
  - "npm package" 

### INSTALLATION FOR MACOS (CREDIT TO @pakoito): 
brew install tesseract
cp ~/Downloads/jpn.traineddata /usr/local/Cellar/tesseract/4.1.1/shared/tessdata/jpn.traineddata
pip3 install opencv-python numpy flask flask-cors mss python-dotenv
git clone https://github.com/leminhyen2/Visual-Novel-OCR.git
cd Visual-Novel-OCR/userInterface
npm install
npm start
# new terminal
cd ../backendServer
vi node-tesseract-ocr.js
# -  const binary = "Tesseract-OCR\\tesseract.exe"
# +  const binary = "/usr/local/Cellar/tesseract/4.1.1/bin/tesseract"
python3 -m flask run
# new terminal
npm install
node server.js
