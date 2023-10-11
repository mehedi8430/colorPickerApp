# Color Picker Application

**Author:** [Mehedi Hasan]

## Description

This is a color picker application with extensive DOM functionalities. It allows you to generate random colors, input colors in hexadecimal format, adjust colors using RGB sliders, and save custom colors, delete custom colors, undo and redo colors. You can also select from a list of preset colors and set background preferences.

## Key Features

- Default color and preset colors provided and copy preset color with toast message.
- Custom colors can be saved and stored in local storage and copy custom color with toast messagew.
- Users can copy color values to the clipboard.
- A toast message is displayed when colors are copied.
- Color values can be entered in both HEX and RGB formats.
- Sliders provided for adjusting RGB color components.
- Event listeners handle user interactions and trigger appropriate actions.
- Utility functions for color conversions and validation.
- HTML and CSS create a user-friendly interface.
- Set background preferences (size, repeat, position, attachment).
- delete custom color
- implement undo and redo functionality

## Getting Started

1. Clone this repository.git clone <https://github.com/mehedi8430/colorPickerApp.git>
2. Open `index.html` in your web browser.
3. Start picking and customizing colors!

## Usage

- Generate Random Color: Click the "Generate Random Color" button to generate a random color.
- Input Hex Color: Enter a valid hexadecimal color code in the input field to set a custom color.
- Adjust RGB Sliders: Use the RGB sliders to fine-tune the color.
- Copy Color Code: Click the "Copy" button to copy the color code to the clipboard. A toast message will appear to confirm the copy.also click on the preset and custom color box hex code will copy to the clipboard.
- Save Custom Color: Click the "Save" button to save the current custom color. Saved colors are displayed below the custom color input.
- Delete Custom Color: Hover over a saved custom color box, and a "Delete" button will appear. Click it to remove the color from the saved list.
- Preset Colors: Click on a preset color box to copy its color code to the clipboard.
- Background Preferences: Customize background size, repeat, position, and attachment using the corresponding dropdowns.
- undo and redo: click on undo button to pop the last color from colorHistory and push it onto redoHistory. Then, update the UI with the previous color and redo button pop the last color from redoHistory and push it back onto colorHistory Then, update the UI with the next color.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# colorPickerApp
