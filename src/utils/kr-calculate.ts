const KRCalculate = (value: any) => {
  const calculateProgress = (calculation: any) => {
    let tempCal = calculation;
    let tempResult = 0;
    if (isFinite(tempCal)) {
      if (isNaN(tempCal)) {
        tempResult = 0;
      } else {
        tempResult = tempCal;
      }
    } else {
      tempResult = 0;
    }
    console.log(`result : ${tempResult}`);
    return tempResult;
  };

  let progress = 0;
  switch (value.boundaries) {
    case "none":
      progress = calculateProgress((value.actual / value.target) * 100);
      if (value.starting) {
        if (value.actual < value.starting) {
          progress = 0;
        }
      }
      break;
    case "minimum":
      // tslint:disable-next-line: prefer-conditional-expression
      if (value.actual < value.target) {
        progress = 0;
      } else {
        progress = calculateProgress((value.actual / value.target) * 100);
      }
      break;
    case "maximum":
      if (value.starting < value.target) {
        // tslint:disable-next-line: prefer-conditional-expression
        if (value.actual < value.starting) {
          progress = 0;
        } else if (value.actual === value.starting) {
          progress = calculateProgress(
            ((value.target - value.actual) / value.target) * 100 + 100,
          );
        } else if (
          value.actual > value.starting &&
          value.actual < value.target
        ) {
          progress = calculateProgress(
            ((value.target - value.actual) / value.target) * 100 + 100,
          );
        } else if (value.target === value.actual) {
          progress = 100;
        } else {
          progress = 0;
        }
      } else {
        // tslint:disable-next-line: prefer-conditional-expression
        if (value.actual > value.starting) {
          progress = 0;
        } else if (value.actual === value.target) {
          progress = 100;
        } else {
          progress = calculateProgress(
            100 + ((value.target - value.actual) / value.target) * 100,
          );
        }
      }

      break;
    case "through":
      if (value.starting < value.target) {
        // tslint:disable-next-line: prefer-conditional-expression
        if (value.actual < value.starting) {
          progress = 0;
        } else if (
          value.starting <= value.actual &&
          value.target >= value.actual
        ) {
          progress = 100;
        } else {
          progress = calculateProgress((value.actual / value.target) * 100);
        }
      } else {
        // tslint:disable-next-line: prefer-conditional-expression
        if (value.actual > value.starting) {
          progress = 0;
        } else if (value.starting === value.actual) {
          progress = 100;
        } else if (
          value.starting < value.actual &&
          value.target < value.actual
        ) {
          progress = 100;
        } else if (
          value.starting > value.actual &&
          value.target < value.actual
        ) {
          progress = 100;
        } else if (value.target === value.actual) {
          progress = 100;
        } else {
          progress = calculateProgress(
            100 + ((value.target - value.actual) / value.target) * 100,
          );
        }
      }
      break;
    case "upto":
      // tslint:disable-next-line: prefer-conditional-expression
      if (value.starting <= value.actual && value.target >= value.actual) {
        progress = 100;
      } else if (
        value.starting >= value.actual &&
        value.target <= value.actual
      ) {
        progress = 100;
      } else {
        progress = 0;
      }
      break;
    default:
      progress = 0;
      break;
  }
  return progress;
};

export default KRCalculate;
