class Utils {
  /**
   * Get Breakpoint
   * @param {Object} screens - Grid.useBreakpoint() from antd
   * @return {Array} array of breakpoint size
   */
  static getBreakPoint(screens: any) {
    let breakpoints = [];
    for (const key in screens) {
      if (screens.hasOwnProperty(key)) {
        const element = screens[key];
        if (element) {
          breakpoints.push(key);
        }
      }
    }
    return breakpoints;
  }
}

export default Utils;
