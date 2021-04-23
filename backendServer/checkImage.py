import cv2
import numpy as np

fullTextImage = np.arange(1)

currentImage = np.arange(1)

sameImageCount = 0

def checkIfSameImage(image1, image2):
    if ( image1.shape == image2.shape and not(np.bitwise_xor(image1,image2).any()) ):
        return True
    else: 
        return False


def checkIfNewFullTextImage(image):
    global sameImageCount
    global currentImage
    global fullTextImage

    comparisionImage = cv2.imread(image)
    
    if checkIfSameImage(currentImage, comparisionImage):
        sameImageCount = sameImageCount + 1
        if sameImageCount == 2:
            sameImageCount = 0
            if checkIfSameImage(fullTextImage, currentImage) == False :
                fullTextImage = currentImage
                return True                
            else: 
                return False
        else: 
            return False

    else:
        currentImage = comparisionImage
        sameImageCount = 0
        return False

# print(checkIfSameImage(currentImage, image2))
# print(checkIfNewFullTextImage("capturedImage.png"))

