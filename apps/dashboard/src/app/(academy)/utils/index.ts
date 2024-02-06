// this funtion maybe we need it later

function insertDotBeforeJadir(inputString: string): string {
  // Find the index of "jadir"
  const index: number = inputString.indexOf("jadir");

  // Check if "jadir" is found in the string and it's not at the beginning
  if (index !== -1 && index > 0) {
    // Insert a dot before "jadir"
    const modifiedString: string =
      inputString.slice(0, index) + "." + inputString.slice(index);

    return modifiedString;
  } else {
    // Return the original string if "jadir" is not found or it's at the beginning
    return inputString;
  }
}
