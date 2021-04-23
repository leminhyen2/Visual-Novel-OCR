pushd %~dp0

cd userInterface
start userInterface.exe

cd ..

cd backendServer
start /min cmd  /c "activateComputerVision.bat" 
start /min cmd  /c "activateBackendServer.bat" 
start /min cmd  /c "activateDeepLserver.bat" 

cd ..

cd TranslationAggregator.v1.0.6
start TranslationAggregator.exe