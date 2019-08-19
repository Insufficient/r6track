const invalid_char_map = {
  ',': '.',
  ' ': '_',
};
const invalid_char = /[^A-Za-z0-9\-_.]/g;


export function validify_name(name) {
  return name
    .split('')
    .map(char => char in invalid_char_map ? invalid_char_map[char] : char)
    .join()
    .replace(invalid_char, '');
}


// (Inefficient) functions to generate possible permutations of names
// const possible_map = {
//   '_': ['-'],
//   '-': ['_'],
//   'I': ['l', '1'],
//   'l': ['I', '1'],
//   '1': ['I', '1'],
//   '0': ['O'],
//   'O': ['0'],
// };
//
// function possible_names(name) {
//   return possibleNames(name.split(''), []);
// }
//
// function possibleNames(name, prefix) {
//   if (!name.length)
//     return prefix.join('');
//
//   let results = [];
//   let remainder = name.slice();
//   const firstChar = remainder.shift();
//
//
//   if (firstChar in possible_map) {
//     for (const possChar in possible_map[firstChar]) {
//       results.push(possibleNames(remainder, prefix.concat([possChar])));
//     }
//   }
//   results.push(possibleNames(remainder, prefix.concat([firstChar])));
//
//   return results.flat();
// }
