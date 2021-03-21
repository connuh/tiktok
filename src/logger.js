/**
 * @author Conner
 * @since 21/03/21
 */

// Logger Class
class Logger {
  static info = string => console.log(`\x1b[92m[info]\x1b[37m ${string}`);
  static warn = string => console.log(`\x1b[93m[warn]\x1b[37m ${string}`);
  static error = string => console.log(`\x1b[91m[error]\x1b[37m ${string}`);
}

export default Logger;