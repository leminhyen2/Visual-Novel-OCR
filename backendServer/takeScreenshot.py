import mss
import mss.tools

def takeScreenshot(top, left, width, height):
    with mss.mss() as sct:
        # The screen part to capture
        monitor = {"top": top + 5, "left": left + 5, "width": width - 10, "height": height - 10}
        output = "capturedImage.png".format(**monitor)

        # Grab the data
        sct_img = sct.grab(monitor)

        # Save to the picture file
        mss.tools.to_png(sct_img.rgb, sct_img.size, output=output)
        print(output)

