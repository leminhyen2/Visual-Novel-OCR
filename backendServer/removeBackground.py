import cv2
import sys
import numpy as np

# # Initialize to check if HSV min/max value changes
# hMin = sMin = vMin = hMax = sMax = vMax = 0
# phMin = psMin = pvMin = phMax = psMax = pvMax = 0

def removeBackground(hMin, sMin, vMin, hMax, sMax, vMax, binarizedValue):
    # Load in image
    image = cv2.imread('./capturedImage.png')

    # Set minimum and max HSV values to display
    lower = np.array([hMin, sMin, vMin])
    upper = np.array([hMax, sMax, vMax])

    # Create HSV Image and threshold into a range.
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower, upper)
    output = cv2.bitwise_and(image,image, mask= mask)

    ret, inverseBinarizedOutput = cv2.threshold(output,binarizedValue,255,cv2.THRESH_BINARY_INV)

    cv2.imwrite("colorChangedImage.png", inverseBinarizedOutput) 

    return "color processing completed"


