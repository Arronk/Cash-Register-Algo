function checkCashRegister(price, cash, cid) {
  const round = (num) => Math.round(num * 100) / 100;
  const changeUnit = [0.01, 0.05, 0.10, 0.25, 1, 5, 10, 20, 100];
  const changeType = [];
  const changeValue = [];
  const originalChange = round(cash - price);
  const open = [];
  let change = originalChange;

  // Populates the changeType and ChangeValue arrays
  for (const arr in cid) {
    changeType.push(cid[arr][0]);
    changeValue.push(cid[arr][1]);
  }

  // Calculates the total value of cash in the drawer
  const totalCid = round(changeValue.reduce((prev, acc) => prev + acc, 0));

  // Loop through through the changeUnit array whilst the change denomination is greater than the change owed
  for (let index = changeUnit.length - 1; index >= 0; index--) {
    // If no change remains then break out of the loop
    if (!change) {
      break;
    }
    // Once the denomination is smaller than the change owed (e.g. change owed $0.50 denomination $0.25)
    while (changeUnit[index] <= change) {
      // If more change is owing then what is available in this denomination deduct it from change as it will all be used
      if (change >= changeValue[index]) {
        open.push([changeType[index], changeValue[index]]);
        change = round(change - changeValue[index]);
        break;
      } else {
        open.push([changeType[index], round(Math.floor(change / changeUnit[index]) * changeUnit[index])]);
        change = round(change % changeUnit[index]);
      }
    }
  }

  // Check for insufficient funds
  const insufficientFunds = !!(totalCid < originalChange || change > 0);
  if (insufficientFunds) {
    return { status: 'INSUFFICIENT_FUNDS', change: [] };
  }

  // Check for closing the cash register
  const exactChange = totalCid == originalChange;
  if (exactChange) {
    return { status: 'CLOSED', change: cid };
  }

  return { status: 'OPEN', change: open };
}
