type layout = "vertical" | "inline" | "horizontal" | undefined;

class Utils {
  public static classicColors = [
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e",
    "#ffbb78",
    "#2ca02c",
    "#98df8a",
    "#d62728",
    "#ff9896",
    "#9467bd",
    "#c5b0d5",
    "#8c564b",
    "#c49c94",
    "#e377c2",
    "#f7b6d2",
    "#7f7f7f",
    "#c7c7c7",
    "#bcbd22",
    "#dbdb8d",
    "#17becf",
    "#9edae5",
  ];

  public static MediaQuery = {
    xs: "@media only screen and (min-width : 320px) and (max-width : 480px)",
    sm: "@media only screen and (min-width : 768px) and (max-width : 1024px)",
    md: "@media only screen  and (min-width : 1224px)",
    lg: "@media only screen  and (min-width : 1824px)",
  };
  public static MediaQueryDevice = {
    xs:
      "@media only screen and (min-device-width : 320px) and (max-device-width : 480px)",
    sm:
      "@media only screen and (min-device-width : 768px) and (max-device-width : 1024px)",
    md: "@media only screen  and (min-width : 1224px)",
    lg: "@media only screen  and (min-width : 1824px)",
  };
  public static justifyCenter = `
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  `;

  public static slug(str: string): string {
    return str
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  public static titleCase(str: string): string {
    str = str.replace(/[-_]/g, " ");
    return str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  public static capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public static FormLayout: {
    labelCol: any;
    wrapperCol: any;
    layout: layout;
  } = {
    labelCol: { span: 8 },
    wrapperCol: { span: 10 },
    layout: "vertical",
  };

  public static getRandomColor() {
    var letters = "BCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  public static RandomColor(): string {
    return (
      "rgb(" +
      (Math.floor(Math.random() * 56) + 200) +
      ", " +
      (Math.floor(Math.random() * 56) + 200) +
      ", " +
      (Math.floor(Math.random() * 56) + 200) +
      ")"
    );
  }
  public static acronym(str: string): string {
    const _str = Utils.titleCase(str);
    const matches = _str.match(/\b(\w)/g); // ['J','S','O','N']
    let acronym = "";
    if (matches) {
      acronym = matches.join(""); // JSON
    }
    return acronym;
  }
  public static SystemColor: any = {
    OBJ: "#9399ff",
    KR: "#f18867",
    APPROVE: "#9818d6",
    APPROVED: "#21bf73",
    REJECTED: "#ff5151",
    TASK: "#ffa41b",
    CLOSE: "#9818d6",
  };
  public static TagColor: any = {
    open: "geekblue",
    rejected: "red",
    approved: "green",
  };
  //@ts-ignore
  static serialize = (obj: any, prefix: any) => {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push(
          v !== null && typeof v === "object"
            ? Utils.serialize(v, k)
            : encodeURIComponent(k) + "=" + encodeURIComponent(v),
        );
      }
    }
    return str.join("&");
  };
  public static round(str: string): any {
    let newStr: string = str + "";
    newStr = parseFloat(newStr)
      .toFixed(2)
      .toString();
    return newStr.replace(".00", "");
  }
  public static validate(evt: any) {
    const theEvent = evt || window.event;
    let key;
    // Handle paste
    if (theEvent.type === "paste") {
      // eslint-disable-next-line no-restricted-globals
      key = theEvent ? theEvent["clipboardData"].getData("text/plain") : "";
    } else {
      // Handle key press
      key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  formatNumber(value: string): string {
    value += "";
    const list = value.split(".");
    const prefix = list[0].charAt(0) === "-" ? "-" : "";
    let num = prefix ? list[0].slice(1) : list[0];
    let result = "";
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
  }
  public static async roundToTwo(num: any) {
    let floated = num.toFixed(4);
    return parseFloat(floated).toString();
  }

  public static forceDownload(blob: any, filename: string) {
    var a = document.createElement("a");
    a.download = filename;
    a.href = blob;
    // For Firefox https://stackoverflow.com/a/32226068
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Current blob size limit is around 500MB for browsers
  public static downloadResource(url: string, filename: string) {
    if (!filename) {
      filename =
        url
          .split("\\")
          ?.pop()
          ?.split("/")
          ?.pop() || "";
    }

    fetch(url, {
      headers: new Headers({
        Origin: window.location.origin,
      }),
      mode: "cors",
    })
      .then(response => response.blob())
      .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        Utils.forceDownload(blobUrl, filename);
      })
      .catch(e => console.error(e));
  }

  public static notifyMe(message: string, title: string) {
    if (!Notification) {
      return;
    }
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      message = Utils.extractContent(message);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _notification = new Notification(title, {
        icon:
          "https://datalligence.s3.ap-south-1.amazonaws.com/0b05c0af-94f1-417d-8a1c-173bc9c19a2d",
        body: message,
      });
      setTimeout(function() {
        _notification.close();
      }, 3000);
    }
  }
  public static extractContent(s: string) {
    var span = document.createElement("span");
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }
  public static splitHostname() {
    var result: {
      domain: string;
      type: string;
      subdomain: string;
    } = {
      domain: "",
      type: "",
      subdomain: "",
    };
    var regexParse = new RegExp("([a-z-0-9]{2,63}).([a-z.]{2,5})$");
    var urlParts: any = regexParse.exec(window.location.hostname);
    result.domain = urlParts[1];
    result.type = urlParts[2];
    result.subdomain = window.location.hostname
      .replace(result.domain + "." + result.type, "")
      .slice(0, -1);
    return result;
  }

  public static getStartAndEndDate(cycle: string, config: any) {
    let start, end;
    config.forEach((item: any) => {
      if (item.cycle === cycle) {
        start = item.start;
        end = item.end;
      }
    });
    return { start, end };
  }
  public static getPerformaceCycles(settings: any) {
    let tempCycles = settings?.cycles;
    const currentCycle = settings?.current_cycle;
    if (!settings["okr_closed_creation"]) {
      const foundIndex = tempCycles.findIndex(
        (cycle: any) => cycle["name"] === currentCycle,
      );
      if (foundIndex !== -1) {
        const temp = tempCycles?.filter(
          (item: any, index: number) => index >= foundIndex,
        );
        tempCycles = temp;
      }
    }
    if (!settings["okr_yop_creation"]) {
      const foundIndex = tempCycles.findIndex(
        (cycle: any) => cycle["name"] === currentCycle,
      );
      if (foundIndex !== -1) {
        const temp = tempCycles?.filter(
          (item: any, index: number) => index <= foundIndex,
        );
        tempCycles = temp;
        tempCycles = temp;
      }
    }
    return tempCycles;
  }
  public static checkOKRConfigForCheckin(settings: any, kr_cycle: string) {
    let tempCycles = settings?.cycles;
    const currentCycle = settings?.current_cycle;
    if (currentCycle === kr_cycle) {
      return true;
    }
    if (settings["okr_closed_checkin"] || settings["okr_yop_checkin"]) {
      const currentCycleIndex = tempCycles.findIndex(
        (cycle: any) => cycle["name"] === currentCycle,
      );
      const krCycleIndex = tempCycles.findIndex(
        (cycle: any) => cycle["name"] === kr_cycle,
      );
      if (krCycleIndex !== -1 && currentCycleIndex !== -1) {
        if (
          krCycleIndex < currentCycleIndex &&
          settings["okr_closed_checkin"]
        ) {
          return true;
        } else if (
          krCycleIndex > currentCycleIndex &&
          settings["okr_yop_checkin"]
        ) {
          return true;
        }
      }
    }
    return false;
  }
  public static redAmberGreen(str: number) {
    if (str >= 0 && str <= 39) {
      return "red";
    } else if (str >= 40 && str <= 69) {
      return "amber";
    } else if (str >= 70) {
      return "green";
    }
  }
  public static redAmberGreenStroke(str: number) {
    if (str >= 0 && str <= 39) {
      return {
        "0%": "#ef5350",
        "100%": "#e53935",
      };
    } else if (str >= 40 && str <= 69) {
      return {
        "0%": "#ffa726",
        "100%": "#fb8c00",
      };
    } else if (str >= 70) {
      return {
        "0%": "#66bb6a",
        "100%": "#43a047",
      };
    }
  }
}

export default Utils;
