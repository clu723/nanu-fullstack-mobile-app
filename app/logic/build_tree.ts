export type TreeNode = {
  id: string; // identifier including full path, e.g. "General.Notifications"
  label: string; // i.e. "General", "Notifications"
  path: string[]; 
  children?: TreeNode[];
};

// Maps the values of each checkbox, including their parent-child relationships
export type CheckboxesMap = Record<string, boolean>;

export function convertToTree(input: any, path: string[] = []): { node: TreeNode; checked: CheckboxesMap } {
  const label = path[path.length - 1] ?? "root";
  const id = path.join(".") || "root";
  const checked: CheckboxesMap = {};

  // Leaf 
  if (typeof input === "boolean") {
    checked[id] = input;
    return { node: { id, label, path}, checked };
  }

  // Branch
  const children: TreeNode[] = [];
  let result: CheckboxesMap = {};

  for (const key of Object.keys(input)) {
    const { node: childNode, checked: childChecked } = convertToTree(input[key], [...path, key]);
    children.push(childNode);
    result = { ...result, ...childChecked };
  }

  // if all children are true, set parent to true
  const allTrue = children.length > 0 && children.every(c => result[c.id] === true);
  if (id !== "root") result[id] = allTrue;

  return { node: { id, label, path, children }, checked: result };
}

// Builds a map of parent-child relationships for the tree
// Reduces the need to traverse the tree multiple times
export function buildParentMap(root: TreeNode) {
  const parent = new Map<string, string | null>();
  const byId = new Map<string, TreeNode>();

  const dfs = (n: TreeNode, p: string | null) => {
    parent.set(n.id, p);
    byId.set(n.id, n);
    n.children?.forEach(c => dfs(c, n.id));
  };
  dfs(root, null);
  return { parent, byId };
}
