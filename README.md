Want to help out? 
Need tech-support?
Join our discord at https://discord.com/invite/XFbWSjMHJh

Demo Video:
https://www.youtube.com/watch?v=AdLwcU03230

For Mac users:
If you want to use this program, navigate to V2.0 branch

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
  - For Japanese language (horizontal and vertical), choose https://github.com/tesseract-ocr/tessdata_best/blob/master/jpn.traineddata and https://github.com/tesseract-ocr/tessdata_best/blob/master/jpn_vert.traineddata
  - Drag jpn.traineddata and jpn_vert.traineddata to Tesseract-OCR/tessdata
  - Go to backendServer/node-tesseract-ocr.js and update Tesseract-OCR's directory
  - For Window environment, I would the whole folder inside backendServer/

### Activation (same for MacOS): 
- One terminal for User Interface:
```
cd Visual-Novel-OCR/userInterface
npm start
```

- One terminal for NodeJS server:
```
cd Visual-Novel-OCR/backendServer
node server.js
```

- One terminal for Python Flask server:
```
cd Visual-Novel-OCR/backendServer
python3 -m flask run
```

Note: Window developers can click on Visual Novel OCR.bat to open all three commands at the same time

### Build: 
- User Interface:
  - "npm package" 

### INSTALLATION FOR MACOS (CREDIT TO @pakoito FOR THE INITIAL GUIDE): 
- Tesseract-OCR (may need some adjustment on your side):
  - For Japanese language (horizontal and vertical), choose https://github.com/tesseract-ocr/tessdata_best/blob/master/jpn.traineddata and https://github.com/tesseract-ocr/tessdata_best/blob/master/jpn_vert.traineddata

```
brew install tesseract
cp ~/Downloads/jpn.traineddata /usr/local/Cellar/tesseract/4.1.1/share/tessdata/jpn.traineddata
cp ~/Downloads/jpn_vert.traineddata /usr/local/Cellar/tesseract/4.1.1/share/tessdata/jpn_vert.traineddata
```

```
git clone https://github.com/leminhyen2/Visual-Novel-OCR.git
```
- One terminal for User Interface:
```
cd Visual-Novel-OCR/userInterface
npm install
npm start
```

- One terminal for NodeJS server (install packages and change Tesseract directory):
```
cd Visual-Novel-OCR/backendServer
vi node-tesseract-ocr.js
# -  const binary = "Tesseract-OCR\\tesseract.exe"
# +  const binary = "/usr/local/Cellar/tesseract/4.1.1/bin/tesseract"
npm install
node server.js
```

- One terminal for Python Flask server:
```
cd Visual-Novel-OCR/backendServer
pip3 install opencv-python numpy flask flask-cors mss python-dotenv
python3 -m flask run
```

- Note: you can automate all these by writing a shell script
