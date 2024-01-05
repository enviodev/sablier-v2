const logObjectDifference = (theGraphResponseData, envioResponseData) => {
  const keys1 = Object.keys(theGraphResponseData);
  const keys2 = Object.keys(envioResponseData);

  const uniqueKeys = new Set([...keys1, ...keys2]);

  uniqueKeys.forEach((key) => {
    let theGraphVal = theGraphResponseData[key]
      ? theGraphResponseData[key].toString()
      : theGraphResponseData[key];
    let envioVal = envioResponseData[key]
      ? envioResponseData[key].toString()
      : envioResponseData[key];
    if (theGraphVal !== envioVal) {
      if (
        (theGraphResponseData[key] == null && envioResponseData[key] == 0) ||
        theGraphResponseData[key] == undefined
      )
        return; // ignore envio null safety of required value && ignore extra values in envio

      console.log(`Difference in key '${key}':`);
      console.log(`   Graph data: ${theGraphResponseData[key]}`);
      console.log(`   Envio data: ${envioResponseData[key]}`);
    }
  });
};

module.exports = { logObjectDifference };
