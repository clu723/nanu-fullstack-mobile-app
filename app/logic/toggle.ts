import { CheckboxesMap, TreeNode } from "./build_tree";

export function setNodeAndDescendants(node: TreeNode, value: boolean, checked: CheckboxesMap) {
    checked[node.id] = value;
    node.children?.forEach(c => setNodeAndDescendants(c, value, checked));
}

export function recomputeFromChildren(node: TreeNode, checked: CheckboxesMap) {
    if (!node.children?.length) {
        return checked[node.id] ?? false;
    }

    const allTrue = node.children.every(c => recomputeFromChildren(c, checked) === true);
    checked[node.id] = allTrue;
    return checked[node.id];
}

export function updateAncestors(
    startNodeId: string,
    parentMap: Map<string, string | null>,
    byId: Map<string, TreeNode>,
    checked: CheckboxesMap
) {
    let curr = parentMap.get(startNodeId);
    while (curr) {
        const n = byId.get(curr)!;
        const allTrue = (n.children ?? []).every(c => !!checked[c.id]);
        checked[n.id] = allTrue;
        curr = parentMap.get(curr)!;
    }
}

export function toggleNode(
    node: TreeNode,
    next: boolean,
    parentMap: Map<string, string | null>,
    byId: Map<string, TreeNode>,
    checked: CheckboxesMap
): CheckboxesMap {
    const copy = { ...checked };

    if (node.children?.length) {
        setNodeAndDescendants(node, next, copy);
    } else {
        // Leaf toggle
        copy[node.id] = next;
    }

    // Update every ancestor if all(children) === true
    updateAncestors(node.id, parentMap, byId, copy);
    return copy;
}
