const NAME_URL =
  "https://cors-anywhere.herokuapp.com/https://r6tab.com/api/search.php?platform=uplay&search=";
const ID_URL =
  "https://cors-anywhere.herokuapp.com/https://r6tab.com/api/player.php?p_id=";

export async function fetchUserID(p_name) {
  let res = await fetch(NAME_URL + p_name);
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
  return [];
}

export async function fetchUserStats(p_id) {
  let res = await fetch(ID_URL + p_id);
  if (res.status === 200) {
    const json = await res.json();
    return json;
  }
  return {
    playerfound: false
  };
}
