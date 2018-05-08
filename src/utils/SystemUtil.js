/**
 * @author 
 * @mail 
 * @date 2018-1-26 02:16:53
 */
class SystemUtil {

    /**
     * 获取树结构数据中第一个叶子结点 
     * @param {Array} treeList 树结构数据，通常是一级结点列表
     * @param {*} childrenName 子结点的属性名称，根据项目情况，默认为'children'
     */
    static getFirstLeaf(treeList, childrenName = 'children') {
        if (treeList && treeList.length > 0) {
            if (treeList[0].children && treeList[0].children.length > 0) {
                return SystemUtil.getFirstLeaf(treeList[0].children);
            }
            else {
                return treeList[0];
            }
        }
        return null;
    }

    /**
     * 从服务器返回的key字符串中获取key值，现在的格式为：名称+code=1，要获取code
     * @param {string} keyString 服务器返回的key字符串，格式为:名称+code=1
     */
    static getKeyFromKeyString(keyString) {
        if (keyString) {
            let splitArr = keyString.split(/[+|=]/);
            if (splitArr.length > 2) {
                return splitArr[1];
            }
        }
        return null;
    }
}

export default SystemUtil;
