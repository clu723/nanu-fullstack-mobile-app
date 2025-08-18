import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { TreeNode, CheckboxesMap } from "../app/logic/build_tree";

type Props = {
    root: TreeNode;
    checked: CheckboxesMap;
    onToggle: (node: TreeNode, next: boolean) => void;
};

const Row: React.FC<{
    node: TreeNode;
    checked: CheckboxesMap;
    onToggle: (n: TreeNode, v: boolean) => void;
    depth?: number;
}> = ({ node, checked, onToggle, depth = 0 }) => {
    const [open, setOpen] = useState(true);
    const isParent = !!node.children?.length;
    const value = !!checked[node.id];

    return (
        <View style={{ paddingLeft: depth * 12, gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {isParent && (
                    <Pressable onPress={() => setOpen(o => !o)}>
                        <Text>{open ? "▾" : "▸"}</Text>
                    </Pressable>
                )}
                {!isParent && <Text style={{ width: 12 }} />}

                <Pressable
                    onPress={() => onToggle(node, !value)}
                    style={{
                        width: 22, height: 22, borderRadius: 4, borderWidth: 1,
                        alignItems: "center", justifyContent: "center"
                    }}
                >
                    <Text>{value ? "✓" : ""}</Text>
                </Pressable>

                <Text>{node.label}</Text>
            </View>

            {open && node.children?.map(c => (
                <Row key={c.id} node={c} checked={checked} onToggle={onToggle} depth={depth + 1} />
            ))}
        </View>
    );
};

export const Tree: React.FC<Props> = ({ root, checked, onToggle }) => {
    return (
        <View style={{ padding: 16 }}>
            {root.children?.map(c => (
                <Row key={c.id} node={c} checked={checked} onToggle={onToggle} />
            ))}
        </View>
    );
};
