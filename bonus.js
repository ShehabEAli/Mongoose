/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    if (!strs.length) return "";

    let prefix = strs[0];

    for(let i=1; i<strs.length; i++)
    {
        let str = strs[i];
        while(!str.startsWith(prefix))
        {
            prefix = prefix.slice(0, -1);
            if(prefix === "")return "";
        }
    }
    return prefix;
};