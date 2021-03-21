/**
 * @author Conner
 * @since 21/03/21
 */

// Imports
import Util from "./src/util.js";
import Logger from "./src/logger.js";

// Variables
const args = Deno.args;
const stats = {
  checked: 0,
  available: 0,
  taken: 0,
  failed: 0
};

if(args.length >= 2 && !isNaN(args[1])) {
  let usernames = [ ];

  try {
    usernames = (await Util.load(args[0])).filter(u => u.length > 2);
  } catch(e) {
    Logger.error(e);
    Deno.exit(1);
  }

  for(const i in usernames) {
    setTimeout(() => {
      Util.check(usernames[i]).then(valid => {
        stats.checked++;
        if(valid) {
          stats.available++;

          Logger.info(`Username -> ${usernames[i]} | Valid -> ${valid}`);
          Util.append(usernames[i]);
        } else stats.taken++;
      }).catch(e => {
        stats.checked++;
        stats.failed++;

        Logger.error(e);
      });
    }, i * args[1]);
  }

  let checkInt = setInterval(() => {
    if(stats.checked == usernames.length) clearInterval(checkInt);
    Logger.info(`Loaded -> ${usernames.length} | Checked -> ${stats.checked} | Available -> ${stats.available} | Taken -> ${stats.taken} | Failed -> ${stats.failed}`);
  }, 1000);
} else {
  Logger.error("Invalid usage! Please run `deno run -A main.js <wordlist (string)> <interval (number)>`");
}