/**
 * @author Conner
 * @since 21/03/21
 */

// Imports
import { existsSync } from "https://deno.land/std@0.90.0/fs/mod.ts";
import Logger from "./logger.js";

// Variables
const BASE_URL = "https://tiktok.com";

// Util Class
class Util {
  /**
   * @param {String} path 
   * @returns {Promise<Object>}
   * 
   * Takes in a `path` argument, reads it
   * replaces all instances of "\r" and
   * returns content split by "\n"
   */
  static async load(path) {
    try {
      /**
       * Create a variable called `file`
       * which holds the contents of the `path`
       * 
       * If `path` doesn't exist, it will fallback to data/`path`
       */
      const file = await Deno.readTextFile((existsSync(path) ? path : `data/${path}`));

      /**
       * Return `file` with all instances of "\r"
       * replaced and split the file by "\n" (turns it into an array)
       */
      return file.replace(/\r/g, "").split("\n");
    } catch {
      /**
       * If there was an error loading the file
       * throw an error so we can handle in `main.js`
       */
      throw `Unable to load file! (path -> ${path})`;
    }
  }

  /**
   * @param {String} text 
   */
  static async append(text) {
    /**
     * `path` variable for when we throw an error
     * it's nicer to have this dynamic instead of
     * hard coding it
     */
    const path = "data/available.txt";

    try {
      /**
       * Attempts to append the `text` variable (with "\n" suffixed)
       * to the `path` file
       */
      await Deno.writeTextFile(path, `${text}\n`, { append: true });
    } catch {
      /**
       * If there was an error appending to the `path` file
       * we will throw an error to handle in `main.js`
       */
      throw `Unable to write file! (path -> ${path})`;
    }
  }

  /**
   * @param {String} username 
   * @returns {Promise<Boolean>}
   */
  static async check(username) {
    try {
      /**
       * Makes a GET reques to `BASE_URL`/@`username` and 
       * saves the status code in a variable named `status`
       */
      let status = await(await fetch(`${BASE_URL}/@${username}`)).status;

      /**
       * If the `status` variable is equal to
       * 403 (Forbidden), we log an error and exit
       * 
       * the 403 only occurs when we're being ratelimited
       */
      if(status === 403) {
        Logger.error("403 Forbidden - likely ratelimited (change IP and increase interval)");
        Deno.exit(1);
      }

      /**
       * If the `status` variable is equal to
       * 404 (Not Found) that means the username is avialable
       * and we can return `true` else we return `false`
       */
      if(status === 404) return true;
      return false;
    } catch {
      /**
       * If there was an erorr with the GET request (timed out etc)
       * we will throw an errot to handle in the `main.js` file
       */
      throw `Unable to make a GET request (username -> ${username})`;
    }
  }
}

export default Util;