import json

def fix_tree():
    # 1. Load tree_data.json
    with open("tree_data.json", "r") as f:
        data = json.load(f)

    nodes = data["nodes"]
    edges = data["edges"]

    # 2. Fix Gautam's daughter name if it was reverted
    for n in nodes:
        if n.get("id") == "sanaya_sood" or n.get("data", {}).get("name") in ["Sanaya Sood", "Serena Sood"]:
            n["data"]["name"] = "Serena Sood"
            print(f"Updated daughter name to: {n['data']['name']}")

    # Create node lookup
    node_map = {n["id"]: n for n in nodes}

    # Standardize Y spacing to 850px for extra generous vertical generation room
    old_ys = sorted(list(set(n["position"]["y"] for n in nodes if n["type"] == "person")))
    print("Old person Y positions:", old_ys)

    y_mapping = {}
    for idx, old_y in enumerate(old_ys):
        y_mapping[old_y] = (idx - 1) * 850.0

    for n in nodes:
        if n["type"] == "person":
            old_y = n["position"]["y"]
            if old_y in y_mapping:
                n["position"]["y"] = float(y_mapping[old_y])

    # Now align all MARRIAGE nodes
    for n in nodes:
        if n["type"] == "marriage":
            m_id = n["id"]
            spouse_edges = [e for e in edges if e["source"] == m_id or e["target"] == m_id]
            spouse_node_ids = []
            for e in spouse_edges:
                if e["source"] != m_id and e["source"] in node_map and node_map[e["source"]]["type"] == "person":
                    if e["source"] not in spouse_node_ids: spouse_node_ids.append(e["source"])
                if e["target"] != m_id and e["target"] in node_map and node_map[e["target"]]["type"] == "person":
                    if e["target"] not in spouse_node_ids: spouse_node_ids.append(e["target"])

            if spouse_node_ids:
                spouses = [node_map[sid] for sid in spouse_node_ids if sid in node_map]
                if len(spouses) >= 2:
                    h = spouses[0]
                    w = spouses[1]
                    if h["position"]["x"] > w["position"]["x"]:
                        h, w = w, h
                    n["position"]["y"] = float(h["position"]["y"] + 30.0)
                    n["position"]["x"] = float((h["position"]["x"] + w["position"]["x"] + 160.0) / 2.0 - 10.0)
                elif len(spouses) == 1:
                    p = spouses[0]
                    n["position"]["y"] = float(p["position"]["y"] + 30.0)
                    n["position"]["x"] = float(p["position"]["x"] + 200.0)

    # Now align all CHILD nodes under marriage nodes
    for n in nodes:
        if n["type"] == "marriage":
            m_id = n["id"]
            m_center_x = n["position"]["x"] + 10.0
            
            child_edges = [e for e in edges if e["source"] == m_id and e.get("sourceHandle") == "bottom"]
            child_ids = [e["target"] for e in child_edges if e["target"] in node_map and node_map[e["target"]]["type"] == "person"]

            if len(child_ids) == 1:
                child = node_map[child_ids[0]]
                child["position"]["x"] = float(m_center_x - 80.0)
                print(f"Aligned single child {child['id']} ({child['data'].get('name')}) to X={child['position']['x']} under marriage {m_id} (m_center_x={m_center_x})")
            elif len(child_ids) == 2:
                c1 = node_map[child_ids[0]]
                c2 = node_map[child_ids[1]]
                if c1["position"]["x"] > c2["position"]["x"]:
                    c1, c2 = c2, c1
                c1["position"]["x"] = float(m_center_x - 80.0 - 150.0)
                c2["position"]["x"] = float(m_center_x - 80.0 + 150.0)
            elif len(child_ids) == 3:
                c1 = node_map[child_ids[0]]
                c2 = node_map[child_ids[1]]
                c3 = node_map[child_ids[2]]
                sorted_c = sorted([c1, c2, c3], key=lambda x: x["position"]["x"])
                sorted_c[0]["position"]["x"] = float(m_center_x - 80.0 - 250.0)
                sorted_c[1]["position"]["x"] = float(m_center_x - 80.0)
                sorted_c[2]["position"]["x"] = float(m_center_x - 80.0 + 250.0)

    # Write back to tree_data.json
    with open("tree_data.json", "w") as f:
        json.dump({"nodes": nodes, "edges": edges}, f, indent=2)

    # Write back to initialData.js
    nodes_js = json.dumps(nodes, indent=4)
    edges_js = json.dumps(edges, indent=4)
    js_content = f"""// Auto-aligned layout with 480px vertical spacing and exact straight edges
export const initialNodes = {nodes_js};
export const initialEdges = {edges_js};
"""
    with open("../src/store/initialData.js", "w") as f:
        f.write(js_content)

    print("Successfully re-aligned tree data and saved to tree_data.json and initialData.js!")

if __name__ == "__main__":
    fix_tree()
