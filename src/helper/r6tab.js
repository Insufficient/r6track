import {timeout} from "./utils";

const NAME_URL =
  "https://cors-anywhere.herokuapp.com/https://r6tab.com/api/search.php?platform=uplay&search=";
const ID_URL =
  "https://cors-anywhere.herokuapp.com/https://r6tab.com/api/player.php?p_id=";
const API_TIMEOUT = 15 * 1000;

export async function fetchUserID(p_name) {
  try {
    let res = await timeout(API_TIMEOUT, "R6Tab API timed out", fetch(NAME_URL + p_name));
    if (res.status === 200) {
      const json = await res.json();
      if (json.totalresults === 0) return [];

      let arr = json.results.map(ele => {
        return {
          name: ele.p_name,
          user: ele.p_user,
          id: ele.p_id
        };
      });
      return arr;
    }
  } catch(e) {
    console.log(e);
    alert(e);
  }
  return [];
}

export async function fetchUserStats(p_id) {
  try {
    let res = await timeout(API_TIMEOUT, "R6Tab API timed out", fetch(ID_URL + p_id));
    if (res.status === 200) {
      const json = await res.json();
      return json;
    }
  } catch(e) {
    console.log(e);
    alert(e);
  }
  return {
    playerfound: false
  };
}
